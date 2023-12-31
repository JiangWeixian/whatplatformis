use std::path::PathBuf;

use swc_core::ecma::transforms::testing::test_fixture;
use testing::fixture;

use swc_plugin_whatplatformis::whatplatform::{whatplatform, WhatPlatformConfig};

#[fixture("tests/fixtures/server/**/input.ts")]
fn fixture_server(input: PathBuf) {
    let output = input.parent().unwrap().join("output.ts");

    test_fixture(
        Default::default(),
        &|_| whatplatform(WhatPlatformConfig {
          target: String::from("server"),
          packages: vec![String::from("whatplatformis")]
        }),
        &input,
        &output,
        Default::default(),
    );
}

#[fixture("tests/fixtures/browser/**/input.ts")]
fn fixture_browser(input: PathBuf) {
    let output = input.parent().unwrap().join("output.ts");

    test_fixture(
        Default::default(),
        &|_| whatplatform(WhatPlatformConfig {
          target: String::from("browser"),
          packages: vec![String::from("whatplatformis")]
        }),
        &input,
        &output,
        Default::default(),
    );
}

#[fixture("tests/fixtures/custom/**/input.ts")]
fn fixture_custom(input: PathBuf) {
    let output = input.parent().unwrap().join("output.ts");

    test_fixture(
        Default::default(),
        &|_| whatplatform(WhatPlatformConfig {
          target: String::from("browser"),
          packages: vec![String::from("is-server")]
        }),
        &input,
        &output,
        Default::default(),
    );
}
