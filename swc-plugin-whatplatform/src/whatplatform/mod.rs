use swc_core::ecma::{
    ast::*,
    visit::{Fold, FoldWith},
};
use tracing::debug;

#[derive(Debug, Default)]
pub struct WhatPlatform {
    is_server_ident: Option<Id>,
    is_browser_ident: Option<Id>,
    target: String,
    packages: Vec<String>
}

pub struct WhatPlatformConfig {
    pub target: String,
    pub packages: Vec<String>
}

impl Fold for WhatPlatform {
    // Implement necessary visit_mut_* methods for actual custom transform.
    // A comprehensive list of possible visitor methods can be found here:
    // https://rustdoc.swc.rs/swc_ecma_visit/trait.VisitMut.html
    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut new_items: Vec<ModuleItem> = vec![];

        for item in items {
            new_items.push(item.clone().fold_with(self));

            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = &item {
                let ident = import_decl.src.value.to_string();
                if self.packages.iter().any(|p| ident == *p) {
                    for spec in &import_decl.specifiers {
                        if let ImportSpecifier::Named(named_import) = spec {
                            let name = match &named_import.imported {
                                Some(n) => match n {
                                    ModuleExportName::Ident(n) => n.sym.to_string(),
                                    ModuleExportName::Str(n) => n.value.to_string(),
                                },
                                None => named_import.local.sym.to_string(),
                            };
                            if name == "isServer" {
                                self.is_server_ident = Some(named_import.local.to_id());
                            } else if name == "isBrowser" {
                                self.is_browser_ident = Some(named_import.local.to_id());
                            }
                        }
                    }
                }
            }
        }
        new_items
    }

    fn fold_ident(&mut self, n: Ident) -> Ident {
        if let Some(is_server) = &self.is_server_ident {
            if &n.to_id() == is_server {
                let mut server = "true";
                if &self.target == "server" {
                    server = "true"
                } else {
                    server = "false"
                }
                debug!("target: {:#?}", server);
                return Ident::new(server.into() , n.span);
            }
        }
        if let Some(is_browser) = &self.is_browser_ident {
            if &n.to_id() == is_browser {
                let mut browser = "true";
                if &self.target == "browser" {
                    browser = "true"
                } else {
                    browser = "false"
                }
                debug!("target: {:#?}", browser);
                return Ident::new(browser.into() , n.span);
            } 
        }
        n
    }
}

pub fn whatplatform(config: WhatPlatformConfig) -> impl Fold {
    WhatPlatform {
        target: config.target,
        packages: config.packages,
        ..Default::default()
    }
}
