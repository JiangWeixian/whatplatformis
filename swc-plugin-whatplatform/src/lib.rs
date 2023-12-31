pub mod whatplatform;

use serde::Deserialize;
use swc_core::ecma::{ast::Program, visit::FoldWith};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use whatplatform::{whatplatform, WhatPlatformConfig};

fn default_packages() -> Vec<String> {
    vec![String::from("whatplatformis")]
}

fn default_target() -> String {
    String::from("server")
}

#[derive(Clone, Debug, Deserialize)]
struct Config {
    #[serde(default = "default_packages")]
    pub packages: Vec<String>,
    #[serde(default = "default_target")]
    pub target: String,
}

/// An example plugin function with macro support.
/// `plugin_transform` macro interop pointers into deserialized structs, as well
/// as returning ptr back to host.
///
/// It is possible to opt out from macro by writing transform fn manually
/// if plugin need to handle low-level ptr directly via
/// `__transform_plugin_process_impl(
///     ast_ptr: *const u8, ast_ptr_len: i32,
///     unresolved_mark: u32, should_enable_comments_proxy: i32) ->
///     i32 /*  0 for success, fail otherwise.
///             Note this is only for internal pointer interop result,
///             not actual transform result */`
///
/// This requires manual handling of serialization / deserialization from ptrs.
/// Refer swc_plugin_macro to see how does it work internally.
#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let plugin_config = serde_json::from_str::<Config>(
        &metadata
            .get_transform_plugin_config()
            .expect("failed to get plugin config for swc_plugin_whatplatform"),
    )
    .expect("Should provide plugin config");
    let packages = plugin_config.packages;
    let target = plugin_config.target;
    let config = WhatPlatformConfig { target, packages };
    let mut whatplatform = whatplatform(config);
    program.fold_with(&mut whatplatform)
}
