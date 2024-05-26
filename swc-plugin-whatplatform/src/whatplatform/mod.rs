use swc_core::{
    common::DUMMY_SP,
    ecma::{
        ast::*,
        visit::{Fold, FoldWith},
    },
};
use tracing::debug;

#[derive(Debug, Default)]
pub struct WhatPlatform {
    is_server_ident: Option<Id>,
    is_browser_ident: Option<Id>,
    target: String,
    packages: Vec<String>,
    is_server_fns: Vec<String>,
}

pub struct WhatPlatformConfig {
    pub target: String,
    pub packages: Vec<String>,
    pub is_server_fns: Vec<String>,
}

impl WhatPlatform {
    fn is_server_fn(&self, ident: &Ident) -> bool {
        return self.is_server_fns.iter().any(|f| {
            if ident.sym.to_string() == *f {
                return true;
            }
            return false;
        });
    }
    fn has_condition_call(&self, expr: &Expr) -> bool {
        if let Expr::Call(call) = expr {
            if let Callee::Expr(box Expr::Ident(ident)) = &call.callee {
                return self.is_server_fn(ident);
            }
            if let Callee::Expr(box Expr::Member(mem)) = &call.callee {
                if let MemberProp::Ident(ident) = &mem.prop {
                    return self.is_server_fn(ident);
                }
            }
        }
        if let Expr::OptChain(call) = expr {
            if let box OptChainBase::Call(optcall) = &call.base {
                if let box Expr::Ident(ident) = &optcall.callee {
                    return self.is_server_fn(&ident);
                }
            }
        }
        return false;
    }
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

    fn fold_expr(&mut self, n: Expr) -> Expr {
        if self.has_condition_call(&n) {
            return Expr::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value: self.target.as_str() == "server",
            }));
        }
        n.fold_children_with(self)
    }

    fn fold_bin_expr(&mut self, n: BinExpr) -> BinExpr {
        if self.has_condition_call(&n.left) {
            return BinExpr {
                left: Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: self.target.as_str() == "server",
                }))),
                ..n
            };
        }
        if self.has_condition_call(&n.right) {
            return BinExpr {
                right: Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: self.target.as_str() == "server",
                }))),
                ..n
            };
        }
        n.fold_children_with(self)
    }

    // const x = isSSR();
    fn fold_var_declarator(&mut self, n: VarDeclarator) -> VarDeclarator {
        if let Some(box init) = &n.init {
            if self.has_condition_call(init) {
                return VarDeclarator {
                    init: Some(Box::new(Expr::Lit(Lit::Bool(Bool {
                        span: DUMMY_SP,
                        value: self.target.as_str() == "server",
                    })))),
                    ..n
                };
            }
        }
        n.fold_children_with(self)
    }

    fn fold_ident(&mut self, n: Ident) -> Ident {
        if let Some(is_server) = &self.is_server_ident {
            if &n.to_id() == is_server {
                let server = match self.target.as_str() {
                    "server" => "true",
                    _ => "false",
                };
                debug!("target: {:#?}", server);
                return Ident::new(server.into(), n.span);
            }
        }
        if let Some(is_browser) = &self.is_browser_ident {
            if &n.to_id() == is_browser {
                let browser = match self.target.as_str() {
                    "browser" => "true",
                    _ => "false",
                };
                debug!("target: {:#?}", browser);
                return Ident::new(browser.into(), n.span);
            }
        }
        n
    }
}

pub fn whatplatform(config: WhatPlatformConfig) -> impl Fold {
    WhatPlatform {
        target: config.target,
        packages: config.packages,
        is_server_fns: config.is_server_fns,
        ..Default::default()
    }
}
