self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^\\/neobarberclub(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|admin|_next\\/static|_next\\/image|images|favicon.ico|sitemap.xml|robots.txt|.*\\..*$).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$",
    "originalSource": "/((?!api|admin|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt|.*\\..*$).*)"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()