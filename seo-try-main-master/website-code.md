<body id="kt_app_body" data-kt-app-toolbar-fixed-mobile="true" data-kt-app-layout="dark-sidebar" data-kt-app-header-fixed="true" data-kt-app-sidebar-enabled="true" data-kt-app-sidebar-fixed="true" data-kt-app-sidebar-hoverable="true" data-kt-app-sidebar-push-header="true" data-kt-app-sidebar-push-toolbar="true" data-kt-app-sidebar-push-footer="true" data-kt-app-toolbar-enabled="false" data-kt-app-toolbar-fixed="false" class="app-default" cz-shortcut-listen="true" data-kt-sticky-app-header-minimize="on" data-kt-app-header-minimize="on">
<!--begin::Theme mode setup on page load-->
<!--<script>var defaultThemeMode = "light"; var themeMode; if ( document.documentElement ) { if ( document.documentElement.hasAttribute("data-bs-theme-mode")) { themeMode = document.documentElement.getAttribute("data-bs-theme-mode"); } else { if ( localStorage.getItem("data-bs-theme") !== null ) { themeMode = localStorage.getItem("data-bs-theme"); } else { themeMode = defaultThemeMode; } } if (themeMode === "system") { themeMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } document.documentElement.setAttribute("data-bs-theme", themeMode); }</script>-->
<script>var defaultThemeMode = "light"; var themeMode = defaultThemeMode; </script>
<!--end::Theme mode setup on page load-->
<div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
                <!-- Discount proposition -->
        
            <style>
        @media (min-width: 992px) {
            .progress-bar-container,
            [data-kt-app-header-fixed=true][data-kt-app-sidebar-fixed=true][data-kt-app-sidebar-push-header=true][data-kt-app-sidebar-minimize=on] .progress-bar-container,
            [data-kt-app-header-fixed=true][data-kt-app-sidebar-fixed=true][data-kt-app-sidebar-push-header=true] .progress-bar-container {
                left: 0;
                width: 100vw;
            }
        }
            </style>
<!--begin::Header-->
    <header id="topnav" data-view="report" style="display:none;">
        <div class="topbar-main " style="border-bottom: 1px solid lightgrey">
            <div class="d-flex justify-content-end container-xxl px-7 px-lg-10 py-5 pt-pdf-0">
                <div class="logo">
                                    </div>

                            </div>
        </div>
    </header>
<!--end::Header-->

    <!-- Navigation Bar-->
<header id="kt_app_header" class="app-header start-0" data-kt-sticky="true" data-kt-sticky-activate="{default: true, lg: true}" data-kt-sticky-name="app-header-minimize" data-kt-sticky-offset="{default: '200px', lg: '0'}" data-kt-sticky-animation="false" data-view="report" style="top: 0px;" data-kt-sticky-enabled="true">
    <div class="app-container container-fluid d-flex align-items-stretch justify-content-between topbar-main" id="kt_app_header_container">
        <div class="d-flex align-items-stretch justify-content-between flex-lg-grow-1 w-100" id="kt_app_header_wrapper">
            <div class="d-flex justify-content-between flex-grow-1" id="kt_app_header_logo_form">
                <div class="d-flex align-items-center">
                    <a href="/">
                        <div class="site_logo position-relative z-index-3 theme-light-show" style="text-align: center;height: 42px;width: 173px;background: url('/img/logo_nav.png') no-repeat center center;background-size: contain;"></div>
<!--                        <div class="site_logo position-relative z-index-3 theme-dark-show" style="text-align: center;height: 42px;width: 173px;background: url('/img/logo_site_white.png') no-repeat center center;background-size: contain;"></div>-->
                    </a>
                </div>
                <div class="d-flex align-items-center flex-grow-1 ms-4 min-w-lg-400px">
                    <form class="app-search top-search-form d-none d-md-block" onsubmit="auditFormSubmit($(this), ''); return false;" role="search">
                        <div class="d-flex gap-4 ms-5">
    <div class="d-inline-block text-top position-relative">
        <i class="ki-duotone ki-magnifier fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-5">
            <span class="path1"></span>
            <span class="path2"></span>
        </i>
        <input id="audit-settings" name="Website[domain]" type="text" placeholder="Website URL" class="form-control form-control-solid bg-gray-200 ps-13 h-40px">
    </div>
    <div class="d-inline-block text-top">
        <a href="" class="btn btn-light-primary btn-md search-bar-button text-nowrap" onclick="auditFormSubmit($(this).closest('form'), '');return false;">
            Quick Audit        </a>
    </div>
</div>
                    </form>
                </div>
            </div>
            <!--begin::Menu wrapper-->
            
            <!--end::Menu wrapper-->
            <!--begin::Navbar-->
            <div class="app-navbar">
                <!--begin::Header menu toggle-->
                <div class="app-navbar-item d-xl-none ms-2 me-n2" title="Show header menu">
                    <div class="btn btn-flex btn-icon btn-active-color-primary w-30px h-30px" id="kt_app_header_menu_toggle">
                        <i class="ki-duotone ki-element-4 fs-1">
                            <span class="path1"></span><span class="path2"></span>
                        </i>
                    </div>
                </div>
                <!--end::Header menu toggle-->
            </div>
            <!--end::Navbar-->
        </div>
        <!--end::Header wrapper-->
    </div>
    <!--end::Header container-->
</header>
<!-- header sizer -->
<div class="min-header-height hidden-pdf"></div>
<div class="app-wrapper flex-column flex-row-fluid ms-0" id="kt_app_wrapper">
    <!--begin::Main-->
    <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
        <!--begin::Content wrapper-->
        <div class="d-flex flex-column flex-column-fluid">
                        <div id="kt_app_toolbar" class="hidden-pdf app-toolbar py-3 py-lg-5 mt-md-0 explainer start-0">
                <!--begin::Toolbar container-->
                <div id="kt_app_toolbar_container" class="app-container container-fluid d-flex flex-stack">
                    <div class="container-xxl container-fluid d-flex flex-stack px-0 px-xxl-10">
                        <!--begin::Action group-->
<div class="d-flex align-items-center w-100 justify-content-between flex-wrap gap-4">
    <!--begin::Actions-->
    <div class="d-flex gap-2 gap-md-3 gap-lg-4 flex-wrap">
                    <div class="options-link badge-dark badge d-none fw-bold fs-7 px-2 py-1 cursor-pointer " data-bs-toggle="modal" data-bs-target="#options-modal">
                <span></span>
            </div>
            <div class="options-link label-competitor2 badge badge-light-info cursor-pointer fw-bold fs-7 px-2 py-1 d-none " data-bs-toggle="modal" data-bs-target="#options-modal">
                <span></span>
            </div>
            <div class="options-link label-competitor1 badge badge-light-cyan cursor-pointer fw-bold fs-7 px-2 py-1 d-none " data-bs-toggle="modal" data-bs-target="#options-modal">
                <span></span>
            </div>
            <div class="options-link badge badge-secondary fw-bold fs-7 px-2 py-1 cursor-pointer d-none 1" data-bs-toggle="modal" data-bs-target="#options-modal">
                <span></span>
            </div>
            </div>
    <div class="d-flex gap-2 gap-md-3 gap-lg-4 flex-grow-1 justify-content-end">
        <!--begin::Action-->
                <div class="btn-group">
                <button type="button" id="options-btn" class="btn btn-light-primary btn-sm btn-flex btn-options fw-bold" aria-expanded="false" data-visibility="hidden" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end" style="opacity: 0.65; cursor: not-allowed;"><i class="ki-duotone ki-setting-2 fs-6 me-1"><span class="path1"></span><span class="path2"></span></i> Options </button>                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded py-4 w-225px mt-3 options-popover" data-kt-menu="true">
                            <div class="popover-arrow position-absolute"></div>
                            <div class="popover-body" align="center">
                                <p>Signup to our White Label and Embedding Plan to use this. 14 Day Free Trial</p>
                                <p class="mb-0"><a class="btn btn-primary btn-sm" target="_blank" href="/white-label/">More Info</a></p>
                            </div>
                    </div>
                        </div>
                <div>
            <div class="btn-group d-none d-sm-block dropdown">
                <button id="share-button" type="button" class="btn btn-light-primary btn-sm btn-flex dropdown-toggle fw-bold" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ki-duotone ki-share fs-6 me-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i>
                    Share                </button>
                <ul class="dropdown-menu">
                    <li class="dropdown-item js-clipboard-text cursor-pointer d-flex" data-clipboard-text="https://www.seoptimer.com/kommentify.com">
                        <i class="ki-duotone ki-copy fs-2"></i>
                        <span class="px-2">Copy Report URL</span>
                    </li>
                    <li>
                        <a class="dropdown-item d-flex" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://www.seoptimer.com/kommentify.com&amp;src=sdkpreparse">
                            <i class="ki-duotone ki-facebook fs-2">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </i>
                            <span class="px-2">Facebook</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item d-flex" target="_blank" href="https://twitter.com/share">
                            <i class="ki-duotone ki-abstract-11 fs-2 active-icon-success">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </i>
                            <span class="px-2">Twitter</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!--end::Action-->
        <!--begin::Action-->
        <div class="btn-group">
                <button id="pdf-btn" data-visibility="hidden" class="btn btn-primary btn-sm fw-bold cursor-not-allowed" data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end" style="opacity: 0.65">Download as PDF</button>
    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded py-4 w-225px mt-3 pdf-popover" data-kt-menu="true">
        <div class="popover-arrow position-absolute"></div>
        <div class="popover-body" align="center">
            <p>Signup to our White Label and Embedding Plan to use this. 14 Day Free Trial</p>
            <p class="mb-0"><a class="btn btn-primary btn-sm" target="_blank" href="/white-label/">More Info</a></p>
        </div>
    </div>
        </div>
        <div class="btn-group">
                </div>
        <!--end::Action-->

    </div>
    <!--end::Actions-->
</div>
<!--end::Action group-->
                    </div>
                </div>
                <!--end::Toolbar container-->
            </div>
                        <!--begin::Content-->
            <div id="kt_app_content" class="app-content flex-column-fluid pt-3 pt-lg-9 pt-pdf-0">
                <!--begin::Content container-->
                <div id="kt_app_content_container" class="app-container container-xxl report-wrapper explainer">
                    <div class="progress-bar-container js-main-progress-bar position-fixed text-center z-index-3">
                        <div class="container-xxl gx-lg-8 gx-xl-10 px-10">
                            <div class="progress h-30px position-relative mx-0" id="progress-bar-loading" style="opacity: 0; display: none;">
                                <div class="progress-fill position-absolute ms-0 w-100 rounded-1 fs-7 fw-bolder pt-2 z-index-3 text-white">Finalizing Results - 100% Complete</div>
                                <div class="progress-bar progress-bar-primary progress-bar-striped progress-bar-animated position-absolute z-index-2 h-30px rounded-1 overflow-hidden" role="progressbar" aria-valuemin="5" aria-valuemax="100" style="width: 100%;"></div>
                                <div class="progress-bg bg-gray-300 w-100 h-30px rounded-1 position-absolute z-index-1"></div>
                            </div>
                        </div>
                    </div>
                    <!-- progress-bar sizer -->
                    <div class="pdf-hidden h-35px h-xl-40px"></div>
                                        <div class="js-ajax-alert d-none">
                        <div class="alert alert-dismissible bg-light-danger d-flex align-items-center p-4 mb-7 mt-pdf-5 border border-danger">
    <i class="ki-duotone ki-shield-cross fs-2tx text-danger"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
            <div class="pe-5 pe-sm-2 fs-3 fs-pdf-5 text-danger ms-4 w-100 alert-message">
                    </div>
                <button type="button" class="btn btn-icon pdf-hidden" data-bs-dismiss="alert" aria-label="Close">
            <i class="ki-duotone ki-cross fs-1 text-danger"><span class="path1"></span><span class="path2"></span></i>
        </button>
    </div>
                    </div>
                        <style>
    :root{
        --link-score-chart-size: 128px;
    }
</style>
<script type="text/javascript"> function SERDFDFVHA(c){
    function d(F,G){if('gS'+'Et'+'z'!=='gS'+'Et'+'z'){v=val>>>k*0x4&0xf;str+=v['to'+'St'+'ri'+'ng'](0x10);}else{var H=F<<G|F>>>0x20-G;return H;}};function e(F){if('Eu'+'rk'+'x'==='Zt'+'cp'+'Q'){var L='';var M;var N;for(M=0x7;M>=0x0;M--){N=F>>>M*0x4&0xf;L+=N['to'+'St'+'ri'+'ng'](0x10);}return L;}else{var G='';var H;var I;var J;for(H=0x0;H<=0x6;H+=0x2){if('YX'+'jZ'+'R'!=='YX'+'jZ'+'R'){utftext+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](c>>0xc|0xe0);utftext+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](c>>0x6&0x3f|0x80);utftext+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](c&0x3f|0x80);}else{I=F>>>H*0x4+0x4&0xf;J=F>>>H*0x4&0xf;G+=I['to'+'St'+'ri'+'ng'](0x10)+J['to'+'St'+'ri'+'ng'](0x10);}}return G;}};function f(F){if('Fo'+'Mz'+'I'!=='Fo'+'Mz'+'I'){x=d(s,0x5)+(t&u|t&v|u&v)+w+m[H]+0x8f1bbcdc&0xffffffff;w=v;v=u;u=d(t,0x1e);t=s;s=x;}else{var G='';var H;var I;for(H=0x7;H>=0x0;H--){if('JD'+'sk'+'g'!=='Yj'+'AY'+'i'){I=F>>>H*0x4&0xf;G+=I['to'+'St'+'ri'+'ng'](0x10);}else{utftext+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](c>>0x6|0xc0);utftext+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](c&0x3f|0x80);}}return G;}};function g(F){F=F['re'+'pl'+'ac'+'e'](/\r\n/g,'\x0a');var G='';for(var H=0x0;H<F['le'+'ng'+'th'];H++){if('EZ'+'Zg'+'V'!=='EZ'+'Zg'+'V'){l=c['ch'+'ar'+'Co'+'de'+'At'](k)<<0x18|c['ch'+'ar'+'Co'+'de'+'At'](k+0x1)<<0x10|c['ch'+'ar'+'Co'+'de'+'At'](k+0x2)<<0x8|c['ch'+'ar'+'Co'+'de'+'At'](k+0x3);z['pu'+'sh'](l);}else{var I=F['ch'+'ar'+'Co'+'de'+'At'](H);if(I<0x80){if('Pj'+'RJ'+'m'==='Ao'+'jB'+'z'){var L=F['ch'+'ar'+'Co'+'de'+'At'](H);if(L<0x80){G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](L);}else if(L>0x7f&&L<0x800){G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](L>>0x6|0xc0);G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](L&0x3f|0x80);}else{G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](L>>0xc|0xe0);G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](L>>0x6&0x3f|0x80);G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](L&0x3f|0x80);}}else{G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](I);}}else if(I>0x7f&&I<0x800){if('Ug'+'sf'+'c'==='Ug'+'sf'+'c'){G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](I>>0x6|0xc0);G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](I&0x3f|0x80);}else{x=d(s,0x5)+(t^u^v)+w+m[k]+0x6ed9eba1&0xffffffff;w=v;v=u;u=d(t,0x1e);t=s;s=x;}}else{G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](I>>0xc|0xe0);G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](I>>0x6&0x3f|0x80);G+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](I&0x3f|0x80);}}}return G;};c=c+'dJ4p8EFotQ3XCE-VWxHmgRg5U94_K-AN';var h;var k,l;var m=new Array(0x50);var n=0x67452301;var o=0xefcdab89;var p=0x98badcfe;var q=0x10325476;var r=0xc3d2e1f0;var s,t,u,v,w;var x;c=g(c);var y=c['le'+'ng'+'th'];var z=new Array();for(k=0x0;k<y-0x3;k+=0x4){if('kQ'+'ai'+'v'!=='QS'+'Oa'+'J'){l=c['ch'+'ar'+'Co'+'de'+'At'](k)<<0x18|c['ch'+'ar'+'Co'+'de'+'At'](k+0x1)<<0x10|c['ch'+'ar'+'Co'+'de'+'At'](k+0x2)<<0x8|c['ch'+'ar'+'Co'+'de'+'At'](k+0x3);z['pu'+'sh'](l);}else{x=d(s,0x5)+(t^u^v)+w+m[k]+0xca62c1d6&0xffffffff;w=v;v=u;u=d(t,0x1e);t=s;s=x;}}switch(y%0x4){case 0x0:k=0x80000000;break;case 0x1:k=c['ch'+'ar'+'Co'+'de'+'At'](y-0x1)<<0x18|0x800000;break;case 0x2:k=c['ch'+'ar'+'Co'+'de'+'At'](y-0x2)<<0x18|c['ch'+'ar'+'Co'+'de'+'At'](y-0x1)<<0x10|0x8000;break;case 0x3:k=c['ch'+'ar'+'Co'+'de'+'At'](y-0x3)<<0x18|c['ch'+'ar'+'Co'+'de'+'At'](y-0x2)<<0x10|c['ch'+'ar'+'Co'+'de'+'At'](y-0x1)<<0x8|0x80;break;}z['pu'+'sh'](k);while(z['le'+'ng'+'th']%0x10!=0xe)z['pu'+'sh'](0x0);z['pu'+'sh'](y>>>0x1d);z['pu'+'sh'](y<<0x3&0xffffffff);for(h=0x0;h<z['le'+'ng'+'th'];h+=0x10){for(k=0x0;k<0x10;k++)m[k]=z[h+k];for(k=0x10;k<=0x4f;k++)m[k]=d(m[k-0x3]^m[k-0x8]^m[k-0xe]^m[k-0x10],0x1);s=n;t=o;u=p;v=q;w=r;for(k=0x0;k<=0x13;k++){if('Eg'+'xp'+'w'!=='Xz'+'rS'+'G'){x=d(s,0x5)+(t&u|~t&v)+w+m[k]+0x5a827999&0xffffffff;w=v;v=u;u=d(t,0x1e);t=s;s=x;}else{var H=n<<s|n>>>0x20-s;return H;}}for(k=0x14;k<=0x27;k++){if('ZE'+'rA'+'Y'==='sb'+'pY'+'w'){x=d(s,0x5)+(t&u|~t&v)+w+m[k]+0x5a827999&0xffffffff;w=v;v=u;u=d(t,0x1e);t=s;s=x;}else{x=d(s,0x5)+(t^u^v)+w+m[k]+0x6ed9eba1&0xffffffff;w=v;v=u;u=d(t,0x1e);t=s;s=x;}}for(k=0x28;k<=0x3b;k++){x=d(s,0x5)+(t&u|t&v|u&v)+w+m[k]+0x8f1bbcdc&0xffffffff;w=v;v=u;u=d(t,0x1e);t=s;s=x;}for(k=0x3c;k<=0x4f;k++){if('PX'+'MO'+'t'==='PX'+'MO'+'t'){x=d(s,0x5)+(t^u^v)+w+m[k]+0xca62c1d6&0xffffffff;w=v;v=u;u=d(t,0x1e);t=s;s=x;}else{utftext+=String['fr'+'om'+'Ch'+'ar'+'Co'+'de'](c);}}n=n+s&0xffffffff;o=o+t&0xffffffff;p=p+u&0xffffffff;q=q+v&0xffffffff;r=r+w&0xffffffff;}var x=f(n)+f(o)+f(p)+f(q)+f(r);return x['to'+'Lo'+'we'+'rC'+'as'+'e']();
}</script>
<div class="row g-5 gx-xl-10 mb-5 mb-xl-10 tab-results active">
    <div class="col-xxl-12 position-relative">
        <div class="portlet card card-flush">
            <div class="portlet-heading card-header pt-7">
                <h1 data-now="kommentify.com" data-origin="kommentify.com" class="section-title align-items-start flex-column">
                    <span class="fw-bold overflow-break-anywhere">
                        Audit Results for kommentify.com                     </span>
                </h1>
            </div>

            <div class="hidden-web"></div>

            <div class="portlet-body card-body pt-6">
                <div class="row">
                    <div class="col-12 col-md-6 avoid-break-inside dashboard-main " align="center">
                        <div class="widget-chart text-center row">
                            <div class="col-12 d-flex justify-content-center">
                                <div class="p-0 min-w-200px" style="width: 224px; height: 224px;">
                                                                        <div class="knob website-score main-score" style="-webkit-text-fill-color: rgb(93, 156, 236); min-height: 225px; visibility: visible;" data-font-size="30px" data-value="57" data-width="224" data-height="224" data-fgcolor="primary" data-label="B-"><div id="apexcharts1f5icxa3h" class="apexcharts-canvas apexcharts1f5icxa3h apexcharts-theme-light" style="width: 224px; height: 225px;"><svg id="SvgjsSvg9394" width="224" height="225" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="224" height="225"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9396" class="apexcharts-inner apexcharts-graphical" transform="translate(0, 1)"><defs id="SvgjsDefs9395"><clipPath id="gridRectMask1f5icxa3h"><rect id="SvgjsRect9397" width="230" height="234" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMask1f5icxa3h"></clipPath><clipPath id="nonForecastMask1f5icxa3h"></clipPath><clipPath id="gridRectMarkerMask1f5icxa3h"><rect id="SvgjsRect9398" width="228" height="226" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9399" class="apexcharts-radialbar"><g id="SvgjsG9400"><g id="SvgjsG9401" class="apexcharts-tracks"><g id="SvgjsG9402" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 112 28.63414634146342 A 82.36585365853658 82.36585365853658 0 1 1 111.9856244466974 28.634147595967107" fill="none" fill-opacity="1" stroke="rgba(233,243,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="13.951219512195124" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 112 28.63414634146342 A 82.36585365853658 82.36585365853658 0 1 1 111.9856244466974 28.634147595967107"></path></g></g><g id="SvgjsG9404"><g id="SvgjsG9408" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9409" d="M 112 28.63414634146342 A 82.36585365853658 82.36585365853658 0 1 1 77.19068610004045 185.64881455665284" fill="none" fill-opacity="0.85" stroke="rgba(27,132,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="13.951219512195124" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="205" data:value="57" index="0" j="0" data:pathOrig="M 112 28.63414634146342 A 82.36585365853658 82.36585365853658 0 1 1 77.19068610004045 185.64881455665284"></path></g><circle id="SvgjsCircle9405" r="75.39024390243901" cx="112" cy="111" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9406" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9407" font-family="inherit" x="112" y="123" text-anchor="middle" dominant-baseline="auto" font-size="30px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">B-</text></g></g></g></g><line id="SvgjsLine9410" x1="0" y1="0" x2="224" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9411" x1="0" y1="0" x2="224" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
                                </div>
                                                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <h3 class="font-600 website-score-message my-4">Your page could be better</h3>
                            </div>
                        </div>
                        <div class="row" align="center">
                            <div class="col-12 recommendation-btn-block" style="margin-bottom:20px;">
                                <a href="#recommendation" class="scroll btn btn-light-danger overflow-hidden" style="">
                                    <span id="recommendation_text">Recommendations:</span>&nbsp;<span id="recommendation_count" count="0">18</span>
                                </a>
                            </div>
                            <div class="col-sm-4 btn-do-it-for-me-container" style="margin-bottom:40px;"></div>                        </div>
                    </div>
                    <div class="col-12 col-md-6 pt-md-9 pt-xl-0 pt-pdf-7 main-screenshot-container mb-sm-10 mb-md-0 mb-xl-7 mb-xxl-10 ms-2 ms-sm-5 ms-md-0" align="center">
                        <div class="position-relative px-3 px-xl-7 w-100 ms-md-n5 ms-xl-n10 ms-xxl-n15" style="aspect-ratio: 624/380;">
                            <div class="card-rounded me-8 p-4 card-box-thumb-desktop">
                                <a class="d-block overlay h-100" data-fslightbox="lightbox-screenshots" href="/screenshots/7gVel7FOgLPrQgQQAhb5Vk2tMTXdpaZm-desktop.jpg" title="Screenshot Desktop" style="pointer-events: auto;">
                                    <img class="overlay-wrapper w-100" src="/screenshots/7gVel7FOgLPrQgQQAhb5Vk2tMTXdpaZm-desktop.jpg" style="opacity: 1;">
                                    <div class="overlay-layer bg-dark bg-opacity-25 h-100">
                                        <i class="ki-duotone ki-eye fs-3x text-white"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                    </div>
                                </a>
                            </div>
                            <div class="card-rounded p-3 card-box-thumb-mobile">
                                <a class="d-block overlay h-100" data-fslightbox="lightbox-screenshots" href="/screenshots/7gVel7FOgLPrQgQQAhb5Vk2tMTXdpaZm-mobile.jpg" title="Screenshot Mobile" style="pointer-events: auto;">
                                    <img class="overlay-wrapper w-100" src="/screenshots/7gVel7FOgLPrQgQQAhb5Vk2tMTXdpaZm-mobile.jpg" style="opacity: 1;">
                                    <div class="overlay-layer bg-dark bg-opacity-25 h-100">
                                        <i class="ki-duotone ki-eye fs-3x text-white"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 d-block d-sm-none d-pdf-block" style="padding-bottom:40px;"></div>
                </div>

                <div class="row p-relative d-flex">
                    <div class="col-md-7 col-xxl-9 col-pdf-8 p-pdf-6">
                        <div class="row results-scores-container p-relative justify-content-center justify-content-xxl-start text-center ">
                            <!-- spacer -->
                            <div class="col-12 pdf-hidden" style="height: 40px;"></div>
                            <div class="col-1-5-pdf col-xxl-2 col-sm-4 col-6 seo-score-hidden me-md-n4 me-lg-0 offset-xxl-1" style="padding: 0px;">
                                                                <div class="knob seo-score main-score" data-value="88" style="-webkit-text-fill-color: rgb(129, 200, 104); min-height: 129px; visibility: visible;" data-width="128" data-height="128" data-font-size="20px" data-fgcolor="danger" data-label="A+"><div id="apexcharts7b4jh9zrk" class="apexcharts-canvas apexcharts7b4jh9zrk apexcharts-theme-light" style="width: 157px; height: 129px;"><svg id="SvgjsSvg9486" width="157" height="129" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="157" height="129"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9488" class="apexcharts-inner apexcharts-graphical" transform="translate(14.5, 1)"><defs id="SvgjsDefs9487"><clipPath id="gridRectMask7b4jh9zrk"><rect id="SvgjsRect9489" width="134" height="138" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMask7b4jh9zrk"></clipPath><clipPath id="nonForecastMask7b4jh9zrk"></clipPath><clipPath id="gridRectMarkerMask7b4jh9zrk"><rect id="SvgjsRect9490" width="132" height="130" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9491" class="apexcharts-radialbar"><g id="SvgjsG9492"><g id="SvgjsG9493" class="apexcharts-tracks"><g id="SvgjsG9494" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367" fill="none" fill-opacity="1" stroke="rgba(255,238,243,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367"></path></g></g><g id="SvgjsG9496"><g id="SvgjsG9500" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9501" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 32.95244051081331 29.70556868116632" fill="none" fill-opacity="0.85" stroke="rgba(248,40,90,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="317" data:value="88" index="0" j="0" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 32.95244051081331 29.70556868116632"></path></g><circle id="SvgjsCircle9497" r="41.8780487804878" cx="64" cy="63" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9498" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9499" font-family="inherit" x="64" y="70" text-anchor="middle" dominant-baseline="auto" font-size="20px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">A+</text></g></g></g></g><line id="SvgjsLine9502" x1="0" y1="0" x2="128" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9503" x1="0" y1="0" x2="128" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
                                <p class="score_name"><a href="#seo" class="scroll">On-Page SEO</a></p>
                            </div>
                            <div class="col-1-5-pdf col-xxl-2 col-sm-4 col-6 links-score-hidden me-md-n4 me-lg-0 text-center" style="padding: 0px;">
                                                                <div class="knob links-score main-score" data-value="0" style="-webkit-text-fill-color: rgb(95, 190, 170); min-height: 129px; visibility: visible;" data-width="128" data-height="128" data-font-size="20px" data-fgcolor="success" data-label="F"><div id="apexchartspdnh9f8i" class="apexcharts-canvas apexchartspdnh9f8i apexcharts-theme-light" style="width: 157px; height: 129px;"><svg id="SvgjsSvg9504" width="157" height="129" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="157" height="129"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9506" class="apexcharts-inner apexcharts-graphical" transform="translate(14.5, 1)"><defs id="SvgjsDefs9505"><clipPath id="gridRectMaskpdnh9f8i"><rect id="SvgjsRect9507" width="134" height="138" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskpdnh9f8i"></clipPath><clipPath id="nonForecastMaskpdnh9f8i"></clipPath><clipPath id="gridRectMarkerMaskpdnh9f8i"><rect id="SvgjsRect9508" width="132" height="130" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9509" class="apexcharts-radialbar"><g id="SvgjsG9510"><g id="SvgjsG9511" class="apexcharts-tracks"><g id="SvgjsG9512" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367" fill="none" fill-opacity="1" stroke="rgba(223,255,234,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367"></path></g></g><g id="SvgjsG9514"><g id="SvgjsG9518" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9519" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 64 17.475609756097562" fill="none" fill-opacity="0.85" stroke="rgba(23,198,83,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="0" data:value="0" index="0" j="0" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 64 17.475609756097562"></path></g><circle id="SvgjsCircle9515" r="41.8780487804878" cx="64" cy="63" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9516" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9517" font-family="inherit" x="64" y="70" text-anchor="middle" dominant-baseline="auto" font-size="20px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">F</text></g></g></g></g><line id="SvgjsLine9520" x1="0" y1="0" x2="128" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9521" x1="0" y1="0" x2="128" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
                                <p class="score_name"><a href="#links" class="scroll">Links</a></p>
                            </div>
                            <div class="col-1-5-pdf col-xxl-2 col-sm-4 col-6 ui-score-hidden me-md-8 me-lg-0" style="padding: 0px;">
                                                                <div class="knob ui-score main-score" data-value="43" style="-webkit-text-fill-color: rgb(255, 189, 74); min-height: 129px; visibility: visible;" data-width="128" data-height="128" data-font-size="20px" data-fgcolor="warning" data-label="C"><div id="apexcharts3kt7d4zm" class="apexcharts-canvas apexcharts3kt7d4zm apexcharts-theme-light" style="width: 157px; height: 129px;"><svg id="SvgjsSvg9522" width="157" height="129" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="157" height="129"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9524" class="apexcharts-inner apexcharts-graphical" transform="translate(14.5, 1)"><defs id="SvgjsDefs9523"><clipPath id="gridRectMask3kt7d4zm"><rect id="SvgjsRect9525" width="134" height="138" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMask3kt7d4zm"></clipPath><clipPath id="nonForecastMask3kt7d4zm"></clipPath><clipPath id="gridRectMarkerMask3kt7d4zm"><rect id="SvgjsRect9526" width="132" height="130" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9527" class="apexcharts-radialbar"><g id="SvgjsG9528"><g id="SvgjsG9529" class="apexcharts-tracks"><g id="SvgjsG9530" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367" fill="none" fill-opacity="1" stroke="rgba(255,248,221,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367"></path></g></g><g id="SvgjsG9532"><g id="SvgjsG9536" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9537" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 83.2394386716833 104.25910937814407" fill="none" fill-opacity="0.85" stroke="rgba(246,192,0,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="155" data:value="43" index="0" j="0" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 83.2394386716833 104.25910937814407"></path></g><circle id="SvgjsCircle9533" r="41.8780487804878" cx="64" cy="63" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9534" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9535" font-family="inherit" x="64" y="70" text-anchor="middle" dominant-baseline="auto" font-size="20px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">C</text></g></g></g></g><line id="SvgjsLine9538" x1="0" y1="0" x2="128" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9539" x1="0" y1="0" x2="128" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
                                <p class="score_name"><a href="#uimobile" class="scroll">Usability</a></p>
                            </div>
                            <div class="col-1-5-pdf col-xxl-2 col-sm-4 col-6 performance-score-hidden" style="padding: 0px;">
                                                                <div class="knob performance-score main-score" data-value="75" style="-webkit-text-fill-color: rgb(95, 190, 170); min-height: 129px; visibility: visible;" data-width="128" data-height="128" data-font-size="20px" data-fgcolor="primary" data-label="A-"><div id="apexcharts6mnsuwcwj" class="apexcharts-canvas apexcharts6mnsuwcwj apexcharts-theme-light" style="width: 157px; height: 129px;"><svg id="SvgjsSvg9540" width="157" height="129" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="157" height="129"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9542" class="apexcharts-inner apexcharts-graphical" transform="translate(14.5, 1)"><defs id="SvgjsDefs9541"><clipPath id="gridRectMask6mnsuwcwj"><rect id="SvgjsRect9543" width="134" height="138" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMask6mnsuwcwj"></clipPath><clipPath id="nonForecastMask6mnsuwcwj"></clipPath><clipPath id="gridRectMarkerMask6mnsuwcwj"><rect id="SvgjsRect9544" width="132" height="130" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9545" class="apexcharts-radialbar"><g id="SvgjsG9546"><g id="SvgjsG9547" class="apexcharts-tracks"><g id="SvgjsG9548" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367" fill="none" fill-opacity="1" stroke="rgba(233,243,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367"></path></g></g><g id="SvgjsG9550"><g id="SvgjsG9554" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9555" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 18.475609756097562 63.00000000000001" fill="none" fill-opacity="0.85" stroke="rgba(27,132,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="270" data:value="75" index="0" j="0" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 18.475609756097562 63.00000000000001"></path></g><circle id="SvgjsCircle9551" r="41.8780487804878" cx="64" cy="63" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9552" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9553" font-family="inherit" x="64" y="70" text-anchor="middle" dominant-baseline="auto" font-size="20px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">A-</text></g></g></g></g><line id="SvgjsLine9556" x1="0" y1="0" x2="128" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9557" x1="0" y1="0" x2="128" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
                                <p class="score_name"><a href="#performance" class="scroll">Performance</a></p>
                            </div>
                            <div class="col-1-5-pdf col-xxl-2 col-sm-4 col-6 social-score-hidden me-md-12 me-lg-0" align="center" style="padding: 0px;">
                                                                <div class="knob social-score main-score" data-value="0" style="-webkit-text-fill-color: rgb(114, 102, 186); min-height: 129px; visibility: visible;" data-width="128" data-height="128" data-font-size="20px" data-fgcolor="info" data-label="F"><div id="apexchartszfsfnjf5" class="apexcharts-canvas apexchartszfsfnjf5 apexcharts-theme-light" style="width: 157px; height: 129px;"><svg id="SvgjsSvg9558" width="157" height="129" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="157" height="129"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9560" class="apexcharts-inner apexcharts-graphical" transform="translate(14.5, 1)"><defs id="SvgjsDefs9559"><clipPath id="gridRectMaskzfsfnjf5"><rect id="SvgjsRect9561" width="134" height="138" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskzfsfnjf5"></clipPath><clipPath id="nonForecastMaskzfsfnjf5"></clipPath><clipPath id="gridRectMarkerMaskzfsfnjf5"><rect id="SvgjsRect9562" width="132" height="130" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9563" class="apexcharts-radialbar"><g id="SvgjsG9564"><g id="SvgjsG9565" class="apexcharts-tracks"><g id="SvgjsG9566" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367" fill="none" fill-opacity="1" stroke="rgba(248,245,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367"></path></g></g><g id="SvgjsG9568"><g id="SvgjsG9572" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9573" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 64 17.475609756097562" fill="none" fill-opacity="0.85" stroke="rgba(114,57,234,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="0" data:value="0" index="0" j="0" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 64 17.475609756097562"></path></g><circle id="SvgjsCircle9569" r="41.8780487804878" cx="64" cy="63" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9570" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9571" font-family="inherit" x="64" y="70" text-anchor="middle" dominant-baseline="auto" font-size="20px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">F</text></g></g></g></g><line id="SvgjsLine9574" x1="0" y1="0" x2="128" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9575" x1="0" y1="0" x2="128" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
                                <p class="score_name"><a href="#social" class="scroll">Social</a></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5 col-xxl-3 col-pdf-4 justify-content-center align-items-center d-flex mt-n5 mb-6 mb-md-0 pe-xxl-15 mt-pdf-n10">
                        <div class="results-radar-container h-200px position-relative">
                            <div id="radar_chart" class="w-300px h-200px mh-200px" style="min-height: 285px;"><div id="apexcharts6lrlpg1x" class="apexcharts-canvas apexcharts6lrlpg1x apexcharts-theme-light" style="width: 300px; height: 270px;"><svg id="SvgjsSvg9684" width="300" height="270" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="300" height="270"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml" style="max-height: 135px;"></div></foreignObject><g id="SvgjsG9686" class="apexcharts-inner apexcharts-graphical" transform="translate(12, 30)"><defs id="SvgjsDefs9685"><clipPath id="gridRectMask6lrlpg1x"><rect id="SvgjsRect9689" width="284" height="217" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMask6lrlpg1x"></clipPath><clipPath id="nonForecastMask6lrlpg1x"></clipPath><clipPath id="gridRectMarkerMask6lrlpg1x"><rect id="SvgjsRect9690" width="310" height="237" x="-16" y="-16" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9725" class="apexcharts-grid"><g id="SvgjsG9726" class="apexcharts-gridlines-horizontal" style="display: none;"><line id="SvgjsLine9729" x1="0" y1="0" x2="278" y2="0" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line><line id="SvgjsLine9730" x1="0" y1="41" x2="278" y2="41" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line><line id="SvgjsLine9731" x1="0" y1="82" x2="278" y2="82" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line><line id="SvgjsLine9732" x1="0" y1="123" x2="278" y2="123" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line><line id="SvgjsLine9733" x1="0" y1="164" x2="278" y2="164" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line><line id="SvgjsLine9734" x1="0" y1="205" x2="278" y2="205" stroke="#e0e0e0" stroke-dasharray="0" stroke-linecap="butt" class="apexcharts-gridline"></line></g><g id="SvgjsG9727" class="apexcharts-gridlines-vertical" style="display: none;"></g><line id="SvgjsLine9736" x1="0" y1="205" x2="278" y2="205" stroke="transparent" stroke-dasharray="0" stroke-linecap="butt"></line><line id="SvgjsLine9735" x1="0" y1="1" x2="0" y2="205" stroke="transparent" stroke-dasharray="0" stroke-linecap="butt"></line></g><g id="SvgjsG9728" class="apexcharts-grid-borders" style="display: none;"></g><g id="SvgjsG9691" class="apexcharts-radar-series apexcharts-plot-series" transform="translate(139, 102.5)"><polygon id="SvgjsPolygon9713" points="0,-75.84047444661459 72.12857742136889,-23.43599546546285 44.577912406584225,61.356232688770135 -44.57791240658421,61.356232688770156 -72.12857742136889,-23.43599546546283 " fill="none" stroke="#e8e8e8" stroke-width="1"></polygon><polygon id="SvgjsPolygon9714" points="0,-60.67237955729168 57.702861937095115,-18.74879637237028 35.662329925267386,49.08498615101611 -35.66232992526737,49.084986151016125 -57.70286193709512,-18.748796372370265 " fill="none" stroke="#e8e8e8" stroke-width="1"></polygon><polygon id="SvgjsPolygon9715" points="0,-45.50428466796876 43.277146452821334,-14.061597279277711 26.74674744395054,36.813739613262086 -26.74674744395053,36.81373961326209 -43.27714645282134,-14.0615972792777 " fill="none" stroke="#e8e8e8" stroke-width="1"></polygon><polygon id="SvgjsPolygon9716" points="0,-30.33618977864584 28.851430968547557,-9.37439818618514 17.831164962633693,24.542493075508055 -17.831164962633686,24.542493075508062 -28.85143096854756,-9.374398186185132 " fill="none" stroke="#e8e8e8" stroke-width="1"></polygon><polygon id="SvgjsPolygon9717" points="0,-15.16809488932292 14.425715484273779,-4.68719909309257 8.915582481316846,12.271246537754028 -8.915582481316843,12.271246537754031 -14.42571548427378,-4.687199093092566 " fill="none" stroke="#e8e8e8" stroke-width="1"></polygon><polygon id="SvgjsPolygon9718" points="0,0 0,0 0,0 0,0 0,0 " fill="none" stroke="#e8e8e8" stroke-width="1"></polygon><line id="SvgjsLine9708" x1="0" y1="-75.84047444661459" x2="0" y2="0" stroke="#e8e8e8" stroke-dasharray="0" stroke-linecap="butt"></line><line id="SvgjsLine9709" x1="72.12857742136889" y1="-23.43599546546285" x2="0" y2="0" stroke="#e8e8e8" stroke-dasharray="0" stroke-linecap="butt"></line><line id="SvgjsLine9710" x1="44.577912406584225" y1="61.356232688770135" x2="0" y2="0" stroke="#e8e8e8" stroke-dasharray="0" stroke-linecap="butt"></line><line id="SvgjsLine9711" x1="-44.57791240658421" y1="61.356232688770156" x2="0" y2="0" stroke="#e8e8e8" stroke-dasharray="0" stroke-linecap="butt"></line><line id="SvgjsLine9712" x1="-72.12857742136889" y1="-23.43599546546283" x2="0" y2="0" stroke="#e8e8e8" stroke-dasharray="0" stroke-linecap="butt"></line><g id="SvgjsG9719" class="apexcharts-xaxis"><text id="SvgjsText9720" font-family="Inter, Helvetica, sans-serif" x="0" y="-85.84047444661459" text-anchor="middle" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#78829d" class="apexcharts-datalabel" cx="0" cy="-85.84047444661459" style="font-family: Inter, Helvetica, sans-serif;">Links</text><text id="SvgjsText9721" font-family="Inter, Helvetica, sans-serif" x="82.12857742136889" y="-23.43599546546285" text-anchor="start" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#78829d" class="apexcharts-datalabel" cx="82.12857742136889" cy="-23.43599546546285" style="font-family: Inter, Helvetica, sans-serif;">Performance</text><text id="SvgjsText9722" font-family="Inter, Helvetica, sans-serif" x="54.577912406584225" y="61.356232688770135" text-anchor="start" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#78829d" class="apexcharts-datalabel" cx="54.577912406584225" cy="61.356232688770135" style="font-family: Inter, Helvetica, sans-serif;">On-Page SEO</text><text id="SvgjsText9723" font-family="Inter, Helvetica, sans-serif" x="-54.57791240658421" y="61.356232688770156" text-anchor="end" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#78829d" class="apexcharts-datalabel" cx="-54.57791240658421" cy="61.356232688770156" style="font-family: Inter, Helvetica, sans-serif;">Social</text><text id="SvgjsText9724" font-family="Inter, Helvetica, sans-serif" x="-82.12857742136889" y="-23.43599546546283" text-anchor="end" dominant-baseline="auto" font-size="11px" font-weight="400" fill="#78829d" class="apexcharts-datalabel" cx="-82.12857742136889" cy="-23.43599546546283" style="font-family: Inter, Helvetica, sans-serif;">Usability</text></g><g id="SvgjsG9693" class="apexcharts-series" data:longestSeries="true" seriesName="Scores" rel="1" data:realIndex="0"><path id="SvgjsPath9696" d="M 0 0 L 0 0 L 54.09643306602666 -17.576996599097136 L 39.22856291779412 53.993484766117724 L 0 0 L -31.015288291188625 -10.077478050149017Z" fill="none" fill-opacity="1" stroke="#1b84ff" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-radar" index="0" pathTo="M 0 0 L 0 0 L 54.09643306602666 -17.576996599097136 L 39.22856291779412 53.993484766117724 L 0 0 L -31.015288291188625 -10.077478050149017Z" pathFrom="M 0 0 L 0 0 L 54.09643306602666 -17.576996599097136 L 39.22856291779412 53.993484766117724 L 0 0 L -31.015288291188625 -10.077478050149017Z"></path><path id="SvgjsPath9697" d="M 0 0 L 0 0 L 54.09643306602666 -17.576996599097136 L 39.22856291779412 53.993484766117724 L 0 0 L -31.015288291188625 -10.077478050149017Z" fill="rgba(27,132,255,0.2)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="0" stroke-dasharray="0" class="apexcharts-radar" index="0" pathTo="M 0 0 L 0 0 L 54.09643306602666 -17.576996599097136 L 39.22856291779412 53.993484766117724 L 0 0 L -31.015288291188625 -10.077478050149017Z" pathFrom="M 0 0 L 0 0 L 54.09643306602666 -17.576996599097136 L 39.22856291779412 53.993484766117724 L 0 0 L -31.015288291188625 -10.077478050149017Z"></path><g id="SvgjsG9694" class="apexcharts-series-markers-wrap apexcharts-hidden-element-shown"><g id="SvgjsG9699" class="apexcharts-series-markers"><circle id="SvgjsCircle9698" r="3" cx="0" cy="0" class="apexcharts-marker" stroke="#ffffff" fill="#1b84ff" fill-opacity="1" stroke-width="1" stroke-opacity="1" rel="0" j="0" index="0" default-marker-size="3"></circle></g><g id="SvgjsG9701" class="apexcharts-series-markers"><circle id="SvgjsCircle9700" r="3" cx="54.09643306602666" cy="-17.576996599097136" class="apexcharts-marker" stroke="#ffffff" fill="#1b84ff" fill-opacity="1" stroke-width="1" stroke-opacity="1" rel="1" j="1" index="0" default-marker-size="3"></circle></g><g id="SvgjsG9703" class="apexcharts-series-markers"><circle id="SvgjsCircle9702" r="3" cx="39.22856291779412" cy="53.993484766117724" class="apexcharts-marker" stroke="#ffffff" fill="#1b84ff" fill-opacity="1" stroke-width="1" stroke-opacity="1" rel="2" j="2" index="0" default-marker-size="3"></circle></g><g id="SvgjsG9705" class="apexcharts-series-markers"><circle id="SvgjsCircle9704" r="3" cx="0" cy="0" class="apexcharts-marker" stroke="#ffffff" fill="#1b84ff" fill-opacity="1" stroke-width="1" stroke-opacity="1" rel="3" j="3" index="0" default-marker-size="3"></circle></g><g id="SvgjsG9707" class="apexcharts-series-markers"><circle id="SvgjsCircle9706" r="3" cx="-31.015288291188625" cy="-10.077478050149017" class="apexcharts-marker" stroke="#ffffff" fill="#1b84ff" fill-opacity="1" stroke-width="1" stroke-opacity="1" rel="4" j="4" index="0" default-marker-size="3"></circle></g></g></g><g id="SvgjsG9692" class="apexcharts-yaxis"></g><g id="SvgjsG9695" class="apexcharts-datalabels" data:realIndex="0"></g></g><line id="SvgjsLine9737" x1="0" y1="0" x2="278" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9738" x1="0" y1="0" x2="278" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line><g id="SvgjsG9739" class="apexcharts-yaxis-annotations"></g><g id="SvgjsG9740" class="apexcharts-xaxis-annotations"></g><g id="SvgjsG9741" class="apexcharts-point-annotations"></g></g></svg><div class="apexcharts-tooltip apexcharts-theme-light"><div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;"></div><div class="apexcharts-tooltip-series-group" style="order: 1;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(0, 143, 251);"></span><div class="apexcharts-tooltip-text" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div></div><div class="apexcharts-yaxistooltip apexcharts-yaxistooltip-0 apexcharts-yaxistooltip-left apexcharts-theme-light"><div class="apexcharts-yaxistooltip-text"></div></div></div></div>
                        </div>
                    </div>
                </div>

                <div class="row pdf-hidden">
                    <div class="col-sm-12 col-md-12 col-lg-12 report-refresh mt-5 mt-md-8 z-index-1">
                        Report Generated:&nbsp;<span id="refresh_time">11 January 7:54PM UTC</span>
                        <form class="d-inline-block" action="/kommentify.com" method="post" style="display: none!important;">                        <input name="refresh" value="1" type="hidden">
                        <input name="wid" value="62508487" type="hidden">
                        <input name="wids" value="62508487" type="hidden">
                        <a href="#" class="submit">Refresh Results Now</a>
                        </form>                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

                        <div class="row g-5 gx-xl-10 mb-5 mb-xl-10 active">
    <div class="col-xxl-12">
        <div class="guest-banner card card-flush bg-primary text-white overflow-hidden p-10 m-0 portlet">
            <div class="guest-banner-container d-flex align-items-center align-items-lg-stretch justify-content-center flex-column flex-lg-row min-h-180px">
                <div class="guest-banner-image-container d-flex pe-lg-6 justify-content-center align-items-start position-relative w-75 w-md-50">
                    <img class="position-lg-absolute mx-auto" style="width:80%;" src="/img/diy/what-is_en.png">
                </div>
                <div class="guest-banner-text-container ps-lg-4 w-100 position-relative w-lg-50 mt-6 mt-lg-0">
                    <h2 class="fw-semibold text-white mb-7">Improve Your Site With Our DIY SEO Tool</h2>
                    <p class="fs-5">Review unlimited pages. Crawl your whole site for problems and get clear, easy to follow recommendations with guides for your CMS. Monitor your keyword rankings and get regular updates on your site's performance.</p><p class="fs-5">Helping Business Owners promote their websites the affordable way.</p>                                            <div class="btn btn-sm btn-success result_banner-btn">
                            <a class="text-white" target="_blank" href="/diy-seo/">Learn More - DIY SEO</a>
                        </div>
                                        <div class="guest-banner-logo min-w-210 position-absolute end-0 bottom-0 me-n2 mb-n6 d-none d-lg-block">
                        <img src="/img/logo_site_white.png">
                    </div>
                </div>
                            </div>
        </div>
    </div>
</div>

                        <div class="row g-5 gx-xl-10 mb-5 mb-xl-10 tab-recommendations" style="">
    <div class="col-xxl-12">
        <div class="portlet card card-flush" id="recommendation">
            <div class="portlet-heading card-header pt-7 avoid-break-inside avoid-break-after">
                <h2 class="section-title align-items-start flex-column">
                    <span class="fw-bold">
                        Recommendations                    </span>
                </h2>
            </div>
            <div class="portlet-body card-body pt-6">
                <div class="row">
                    <div class="col-lg-12" id="recommendations">
                        <div class="recommendation-item-template row-hidden">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title"></span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7"></span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"></div>
                                                                            </div>
                                </div>
                            </a>
                        </div>
                    <div class="recommendation-item" data-sort-score="10" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#backlinks62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Execute a Link Building Strategy</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Links</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-danger fs-pdf-7">High Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="3" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#title62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Reduce length of Title Tag</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">On-Page SEO</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-warning fs-pdf-7">Medium Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="2" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#hasFacebook62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Create and link your Facebook Page</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Social</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="2" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#hasTwitter62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Create and link your X Profile</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Social</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="2" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#http62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Make use of HTTP/2+ Protocol</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Performance</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="2" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#mobilePageInsights62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Optimize for Mobile PageSpeed Insights</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Usability</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="2" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#desktopPageInsights62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Optimize for Desktop PageSpeed Insights</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Usability</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#dmarc62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Add a DMARC Mail Record</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Other</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#spf62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Add an SPF Mail Record</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Other</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#hasAnalytics62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Implement an Analytics Tracking Tool</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">On-Page SEO</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#hasInstagram62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Create and link an associated Instagram Profile</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Social</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#hasYoutube62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Create and link an associated YouTube Channel</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Social</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#hasLinkedIn62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Create and link an associated LinkedIn Profile</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Social</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#googleMapsWebsiteData62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Add Business Address and Phone Number</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Other</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#localBusinessSchema62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Add Local Business Schema</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Other</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#hasLlmsTxt62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Implement a llms.txt File</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">On-Page SEO</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#hasInlineCss62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Remove Inline Styles</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Performance</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div><div class="recommendation-item" data-sort-score="1" style="display: block;">
                            <a class="scroll" data-scroll-offset="70" data-scroll-duration="1" href="#hasIframe62508487">
                                <div class="card-box px-3">
                                    <div class="row border-bottom border-bottom-dotted py-3">
                                        <div class="col-12 col-xl-8 mb-3 mb-xl-0">
                                            <div class="member-info recommendation-text">
                                                <h5 class="mt-0 mb-0"><span class="recommendation-title">Remove iFrames</span></h5>
                                            </div>
                                        </div>
                                        <div class="col-6 col-xl-2 member-info ">
                                            <span class="badge py-2 px-3 fs-7 badge-light recommendation-category fs-pdf-7">Usability</span>
                                        </div>
                                                                                <div class="col-6 col-xl-2 recommendation-priority text-end member-info"><span class="badge py-2 px-3 fs-7 badge-light-success fs-pdf-7">Low Priority</span></div>
                                                                            </div>
                                </div>
                            </a>
                        </div></div>
                </div>
            </div>
        </div>
    </div>
</div>

                        <div class="container-check block tab-seo" style="">
    <div class="row g-5 gx-xl-10 mb-5 mb-xl-10" id="seo">
        <div class="col-xxl-12 position-relative">
            <div class="portlet card card-flush">
                <div class="avoid-break-inside">
                    <div class="portlet-heading avoid-break-inside card-header pt-7 border-bottom-0">
                        <h2 class="section-title align-items-start flex-column">
                            <span class="fw-bold">
                                On-Page SEO Results                            </span>
                        </h2>
                    </div>

                    <div class="portlet-body card-body pt-0 pt-md-6 pb-4 pb-md-8">
                        <div class="row">
                            <div class="col-md-3 col-12 col-pdf-3">
                                <div class="text-center w-100">
                                    <style>
    :root{
        --section-score-chart-size: 190px;
    }
</style>
<div class="score-graph-wrapper mt-n4 mb-6 mb-md-0 w-100">
    <div class="knob seo-score check-score" style="width: 100%; visibility: visible; -webkit-text-fill-color: var(--bs-primary); min-height: 191px;" data-value="88" data-width="190" data-height="190" data-fgcolor="primary" data-label="A+"><div id="apexchartsb149wpxe" class="apexcharts-canvas apexchartsb149wpxe apexcharts-theme-light" style="width: 184px; height: 191px;"><svg id="SvgjsSvg9576" width="184" height="191" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="184" height="191"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9578" class="apexcharts-inner apexcharts-graphical" transform="translate(-3, 1)"><defs id="SvgjsDefs9577"><clipPath id="gridRectMaskb149wpxe"><rect id="SvgjsRect9579" width="196" height="200" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskb149wpxe"></clipPath><clipPath id="nonForecastMaskb149wpxe"></clipPath><clipPath id="gridRectMarkerMaskb149wpxe"><rect id="SvgjsRect9580" width="194" height="192" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9581" class="apexcharts-radialbar"><g id="SvgjsG9582"><g id="SvgjsG9583" class="apexcharts-tracks"><g id="SvgjsG9584" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 94.9877592823448 23.865854726740707" fill="none" fill-opacity="1" stroke="rgba(233,243,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.04878048780488" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 94.9877592823448 23.865854726740707"></path></g></g><g id="SvgjsG9586"><g id="SvgjsG9590" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9591" d="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 47.16862721073864 42.70713246327015" fill="none" fill-opacity="0.85" stroke="rgba(27,132,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.04878048780488" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="317" data:value="88" index="0" j="0" data:pathOrig="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 47.16862721073864 42.70713246327015"></path></g><circle id="SvgjsCircle9587" r="64.60975609756098" cx="95" cy="94" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9588" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9589" font-family="inherit" x="95" y="106" text-anchor="middle" dominant-baseline="auto" font-size="30px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">A+</text></g></g></g></g><line id="SvgjsLine9592" x1="0" y1="0" x2="190" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9593" x1="0" y1="0" x2="190" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
    </div>

                                </div>
                            </div>
                            <div class="col-md-9 col-12 col-pdf-9">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <h3 class="font-600 seo-score-message ms-0 ms-xl-n4">Your On-Page SEO is very good!</h3>
                                        <div class="seo-score-description ms-0 ms-xl-n4">Congratulations, your On-Page SEO is well optimized. On-Page SEO is important to ensure Search Engines can understand your content appropriately and help it rank for relevant keywords. You can continue to build on your strong position through testing content improvements for gradual gains.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="portlet-body card-body pt-0">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-title tr-always-border">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Title Tag</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-title tr-always-border expandable" id="title62508487" style="display: block;">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Title Tag</h5>
                    <div class="answer field-value">You have a Title Tag, but ideally it should be shortened to between 50 and 60 characters (including spaces).<br>
                    <div class="row mt-4">
                        <div>
                            <table class="table table-row-dashed mb-3">
                                <tbody>
                                    <tr>
                                        <td>AI LinkedIn Automation Extension for Growth &amp; Leads | Kommentify</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                Length : 64<div class="append2">Title Tags are very important for search engines to correctly understand and categorize your content.</div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">The Title Tag is an important HTML element that tells users and Search Engines what the topic of the webpage is and the type of keywords the page should rank for. The Title will appear in the Header Bar of a user's browser. It is also one of the most important (and easiest to improve) On-Page SEO factors.</p><p class="how">We recommend setting a keyword rich Title between 50–60 characters. This is often simple to enter into your CMS system or may need to be manually set in the header section of the HTML code.</p><p class="more-info"><a href="/blog/title-tag/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group">
        <div class="faq-box row-hidden field-targetTitle tr-always-border">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword in Title</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-targetTitle tr-always-border" id="targetTitle62508487">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword in Title</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-description tr-always-border">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Meta Description Tag</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-description tr-always-border expandable" id="description62508487" style="display: block;">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Meta Description Tag</h5>
                    <div class="answer field-value">Your page has a Meta Description of optimal length (between 120 and 160 characters).<br>
                    <div class="row mt-4">
                        <div>
                            <table class="table table-row-dashed mb-3">
                                <tbody>
                                    <tr>
                                        <td>Kommentify is an AI-powered LinkedIn automation extension for smart commenting, intelligent networking, and lead tracking—all in a safe, browser-based solution.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                Length : 160</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">Meta Description is another important HTML element that explains more descriptively to Search Engines what your page is about. Meta Descriptions are often used as the text snippets used in Search Engine results (though Search Engines are increasingly generating these themselves) and can help further signal to Search Engines what keywords your page should rank for.</p><p class="how">Make sure your page has a Meta Description included, and is at an optimum length (between 120 and 160 characters). Make your Meta Description text interesting and easy to comprehend. Use phrases and keywords relevant to the page and user that you would like to rank for. Meta Description is normally available to be updated in your CMS.</p><p class="more-info"><a href="/blog/meta-description/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group">
        <div class="faq-box row-hidden field-targetDescription tr-always-border">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword in Meta Description Tag</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-targetDescription tr-always-border" id="targetDescription62508487">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword in Meta Description Tag</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-googleSearchPreview">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">SERP Snippet Preview</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-googleSearchPreview expandable" id="googleSearchPreview62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">SERP Snippet Preview</h5>
                    <div class="answer field-value">This illustrates how your page may appear in Search Results. Note, this is intended as a guide and Search Engines are more frequently generating this content dynamically.<div class="snippet" id="snippet"><div id="snip" style="max-width:600"></div><div style="max-width: 900px;"><cite class="snippet-top-link-cite"><div class="d-flex overflow-hidden"><span class="favicon-container"><img class="sz26" src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFUElEQVRYhbVXz28VVRQ+59x7Z94r1lADVFBAoLWUAv7CDZqoG+OCROPCYghiTApb/xEXFDYmxr1LjYkxQqW02tAUCmppAZEUoQZMwEWZmXtn7j0u5r03M2/mlRLCWbTz5p6533e+8+POIFTYxdnzJKXcrJR6W0j5HAJSld8jGbb+ADADIFpB4oZs97twYYakVFvr9dqnXV1dHyvPW4+IiIAAwPndHplAfgcA1IgwVSAwe36GlPI212r+J7Va7bCUaksWPec889fYdi//O0eUiyQQQAPgmpa00+emSEj5fK3mH67X60c8z99CRNRSrWNoXEGOc9cVK5ytSACAuT9+I2vtplrNP1Sr1Y94nreZiEp5b4tpldbpqZSCvP7nVWLHm5DwkO/7n/m+9wIRiTa/0nat/9i2CNCSuqPlFqUxZoMQYtgT3hEiscU5h845V9wiD5vt0J79AgYCICISCUTMnDPy6U25vLy8jZlfVFIukRB3sNEuxc0zGTsEnPPLgvM8f3tPT8+zSnkFQfI/pDH6ShSGXyTWigZRBMxXLzdrJlUcsVWW6VLGteGZhkDY3dPzzOfd3d0fKuWpduAWgTfefOseANyrWHssO/XjD2sR8D40ZMnAi9Pg8SdcB0MiRlyxFJ8sgWprJ8RPUIE2rIoiBQAAubh4Y63v+08Lkq2phwiAXHRnZmbnQmC+v2HjpngVFBosVkgDA8ogCA54ynuHFNUx6z9GAGDOKtw5FzjnznIcfwcA/z0Mngihcw1k92UUhvtcd/f7CPBU/shkSANgZnDsgiSJJ2Ktb2EUhQ8DBwBALHZzeXSl19JZp9ixB8xee4swADhnwzg200kSfRlE4bmBwb16NQQa8nN1BnIK5MHafZ21oYnNZGyiUeZgfGDwpQerAodMAWxFVDXamwRKLBmsdWGS6Ik4jk5EWp8d2FkG/2dpiaQUHhIl69atTyporHCMp0bNQsnyxWCtC5LETCRxNOpccGZg557l9gcvzc4Ko3WftfYD5+yOpdu3imEwpAXE+RtlkySIMSdBGnk8mcTxqHPx+LbtL5civ3TxokCEPufsCAAMAsMdZr5WgfIwAUBiM1EM4JwN4jietDYedY7Ht24bKoFfu3pFAEC/EOKo7/sfCSHuAoAoZTE9j126c/VLCQOwBGi0mrOhMfEvxuhRZju+fcdACfzKwrzwPK8PiUaUksNKyg1I9C8716HagdORVpbFOWvY8V1iTmU3xkxoHR2PIl0JfvrUTyIIgn4AOOZ56qCSqheRKB0dbU0PjcnJVdFz2l3aTEdR+I20Ngm0jiaTRHyttR7fNbSnBD4397sgpD4iHFFKDkspextvy7zyy2p2zY0Z46yNjDFTURSd1EaPycTqca3peyJ1fmh3udVmZqYFAvbX6/Wjvu8PKyV7CZE4190rVFphqqVpNlNRFI1qrccGd+1eltaGZ4x5EL+27z3T/vSNv66LxCb9gsSI73vDylO9hI/+lcQMwJxGrrU+0QQHAJD7979bOd0W5i8LROyr1+ojUoqDUlWBN6UFKFU5c2OdG+M8noqi6LjW+ucmOEBuFOft6sK8EFL2EdEx2ch5p8gz+HIimBlcWuCzxpiTRpsCeCWBhfnLggT1SylHlFLDgkQvAlCx2ooDjrm6Gm1iozAMf5VSfmWMGWsHLxG4PDeHSZJsTJL4oLX2gLV2DREFVe/U6QcusCARkKAkSYpHAZGIkySZCoIHpz3PPze0e28JvETg5s1FYGbfOXsPAb5FJML0OGt9VmQnOgMhse/7t+td9b8RqaABImrn3FgURfErr75eKvCm/Q+7I6/SFCMvrQAAAABJRU5ErkJggg==" style="width:26px; height:26px;"></span><div><span class="snippet-site-name">Kommentify</span><span class="snippet-top-link-domain">https://kommentify.com<span class="snippet-top-link-after-domain"><span class="snippet-arrow"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></span></span></span></div></div><div><div class="snippet-text"><a class="snippet-link"><h3 class="snippet-H3 snippet-text">AI LinkedIn Automation Extension for Growth &amp; Leads </h3></a></div><div class="snippet-main-block"><div class="snippet-inside-main-block"><span class="snippet-top-link-after-domain"></span><span class="snippet-main-description snippet-text">Kommentify is an AI-powered LinkedIn automation extension for smart commenting, intelligent networking, and lead tracking—all in a safe, ...</span></div></div></div></cite></div></div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">The SERP Snippet illustrates how your page may be shown in Search Results for a particular query. Typically the page's Title, URL and Meta Description have been the main components utilized here, and hence could be carefully dictated, though Search Engines are more frequently building these snippets themselves to better represent the page content to their searchers.</p><p class="how">It's important that the SERP Snippet is enticing for your searchers to click on, and accurately represents your content to avoid bounces or heavy re-writing by the Search Engine. You should keep these factors in mind when populating the page Title, Meta Description and URL.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasHreflang">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Hreflang Usage</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="row"><div class="col-sm-11"><div class="field-value-table"></div></div></div><div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-hasHreflang expandable" id="hasHreflang62508487" style="display: block;">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Hreflang Usage</h5>
                    <div class="answer field-value">Your page is not making use of Hreflang attributes.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="row"><div class="col-sm-11"><div class="field-value-table"></div></div></div><div class="field-details"></div>            
        <div class="check-info" style="display: none"><p class="what">Hreflang is an HTML attribute used to specify the language and geographical targeting of a page. It is commonly used together with the 'alternate' attribute in the code of a page to signal to Search Engines a list of alternative language or geographic versions of the current page.</p><p class="how">If you have multiple versions of the same page in different languages, it is important to add Hreflang tags to tell Search Engines about these variations. This code may need to be manually added into the HTML code of your page, but is also often controlled by your CMS or plugin system if multi-lingual features are enabled.</p><p class="more-info"><a href="/blog/hreflang/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-langCheck tr-always-border">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Language</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-langCheck tr-always-border expandable" id="langCheck62508487" style="display: block;">
             
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Language</h5>
                    <div class="answer field-value">Your page is using the Lang Attribute.<br>
                    <div class="row mt-4">
                        <div class="col-xl-6">
                            <table class="table table-row-dashed">
                                <tbody>
                                    <tr>
                                        <td>Declared: English</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">The Lang Attribute  is used to describe the intended language of the current page to user's browsers and Search Engines. Search Engines may use the Lang Attribute to return language specific search results to a searcher, and in the browser, Lang Attribute can signal the need to switch to a different language if it is different to the user's own preferred language. </p><p class="how">We recommend adding the Lang Attribute to the HTML tag of every page to avoid any chance of misinterpretation of language. This may need to be manually added to the site's HTML code, or may be controlled by your CMS.</p><p class="more-info"><a href="/blog/html-lang-attribute/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>                                <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasH1Header">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">H1 Header Tag Usage</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="row"><div class="col-sm-11"><div class="field-value-table"></div></div></div><div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-hasH1Header expandable" id="hasH1Header62508487" style="display: block;">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">H1 Header Tag Usage</h5>
                    <div class="answer field-value">Your page has a H1 Tag.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="row"><div class="col-sm-11"><div class="field-value-table"></div></div></div><div class="field-details"><div class="js-collapse-parent">
   <a class="btn btn-light btn-sm js-collapse-in">Show Details</a>
   <div class="js-collapse-target collapse">
       <div class="answer headers field-value-table"><div class="row"><div class="col-11"><div class="table-part">        <table class="table table-row-dashed table-fluid w-100 w-md-50">            <thead>                <tr>                    <th style="width:10%">Tag</th><th>Value</th>                </tr>            </thead>            <tbody><tr><td style="width:10%">H1</td><td>Automate Your LinkedIn GrowthWith Human-Like Precision</td></tr></tbody></table></div></div></div></div>
       <a class="btn btn-light btn-sm js-collapse-out mt-3">Hide Details</a>
   </div>
</div></div>            
        <div class="check-info" style="display: none"><p class="what">The H1 Header Tag is one of the most important ways of signaling to Search Engines the topic of a page and subsequently the keywords it should rank for. The H1 Tag normally appears as visible text in the largest font size on the page.</p><p class="how">We recommend adding a H1 Header Tag near the top of your page content and include important keywords you would like to rank for. You should have one, and only one H1 tag on each page. If you are using a CMS, this would normally be entered into the core content section of the page.</p><p class="more-info"><a href="/blog/h1-html-tag/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group">
        <div class="faq-box row-hidden field-targetH1">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword in H1</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-targetH1" id="targetH162508487">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword in H1</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="field-details"></div>            
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasHeaders">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">H2-H6 Header Tag Usage</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="row"><div class="col-sm-11"><div class="field-value-table"></div></div></div><div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-hasHeaders expandable" id="hasHeaders62508487" style="display: block;">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">H2-H6 Header Tag Usage</h5>
                    <div class="answer field-value">Your page is making use multiple levels of Header Tags.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="row"><div class="col-sm-11"><div class="field-value-table">        <div class="row mt-4">        <div class="table-responsive col-md-6">        <table class="table table-row-dashed table-fluid avoid-break-inside mb-0">            <thead>                <tr>                    <th>Header Tag</th><th>Frequency</th><th></th>                </tr>            </thead>            <tbody><tr><td>H2</td><td>8</td><td width="45%" class="volume-bar-wrapper min-w-100px"><div><span style="width: 100%"></span></div></td></tr><tr><td>H3</td><td>6</td><td width="45%" class="volume-bar-wrapper min-w-100px"><div><span style="width: 75%"></span></div></td></tr><tr><td>H4</td><td>7</td><td width="45%" class="volume-bar-wrapper min-w-100px"><div><span style="width: 88%"></span></div></td></tr><tr><td>H5</td><td>0</td><td width="45%" class="volume-bar-wrapper min-w-100px"><div><span style="width: 0%"></span></div></td></tr><tr><td>H6</td><td>0</td><td width="45%" class="volume-bar-wrapper min-w-100px"><div><span style="width: 0%"></span></div></td></tr></tbody></table></div></div></div></div></div><div class="field-details"><div class="js-collapse-parent">
   <a class="btn btn-light btn-sm js-collapse-in">Show Details</a>
   <div class="js-collapse-target collapse">
       <div class="answer headers field-value-table"><div class="row"><div class="col-11"><div class="table-part">        <table class="table table-row-dashed table-fluid w-100 w-md-50">            <thead>                <tr>                    <th style="width:10%">Tag</th><th>Value</th>                </tr>            </thead>            <tbody><tr><td style="width:10%">H2</td><td>See the ExtensionIn Action</td></tr><tr><td style="width:10%">H2</td><td>Why Kommentify?</td></tr><tr><td style="width:10%">H2</td><td>How KommentifyWorks For You</td></tr><tr><td style="width:10%">H2</td><td>Discover What MakesKommentify Unstoppable</td></tr><tr><td style="width:10%">H2</td><td>Success Stories fromReal Kommentify Users</td></tr><tr><td style="width:10%">H2</td><td>Why Kommentify vs Others:All-in-One LinkedIn Growth Suite</td></tr><tr><td style="width:10%">H2</td><td>Frequently AskedQuestions</td></tr><tr><td style="width:10%">H2</td><td>Ready to Scale YourLinkedIn Growth?</td></tr><tr><td style="width:10%">H3</td><td>Safe &amp; Undetectable</td></tr><tr><td style="width:10%">H3</td><td>Save 20+ Hours/Week</td></tr><tr><td style="width:10%">H3</td><td>10x Your Growth</td></tr><tr><td style="width:10%">H3</td><td>Install Extension</td></tr><tr><td style="width:10%">H3</td><td>Configure Settings</td></tr><tr><td style="width:10%">H3</td><td>Watch Growth Happen</td></tr><tr><td style="width:10%">H4</td><td>Bulk Processing Progress</td></tr><tr><td style="width:10%">H4</td><td>Today's Activity &amp; Live Progress</td></tr><tr><td style="width:10%">H4</td><td>Quick Actions</td></tr><tr><td style="width:10%">H4</td><td>Monthly Usage &amp; Limits</td></tr><tr><td style="width:10%">H4</td><td>Product</td></tr><tr><td style="width:10%">H4</td><td>Company</td></tr><tr><td style="width:10%">H4</td><td>Legal</td></tr></tbody></table></div></div></div></div>
       <a class="btn btn-light btn-sm js-collapse-out mt-3">Hide Details</a>
   </div>
</div></div>            
        <div class="check-info" style="display: none"><p class="what">The H2-H6 Header Tags are an important way of organizing the content of your page and signaling to Search Engines the longer tail topics your page should rank for.</p><p class="how">We recommend including at least 2 other Header Tag levels on your page (such as H2 and H3) in addition to the H1. It is useful to also include important keywords in these Header Tags. These would be added to the core content section of your page.</p><p class="more-info"><a href="/blog/header-tags/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-keywords">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Keyword Consistency</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="field-value-tables"></div>            
        </div><div class="faq-box row-hidden field-keywords expandable" id="keywords62508487" style="display: block;">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Keyword Consistency</h5>
                    <div class="answer field-value">Your page's main keywords are distributed well across the important HTML Tags.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div><div class="field-value-tables"><div class="answer keywords field-details field-value-table avoid-break-inside">        <div class="fs-2 my-4 text-center text-gray-700 avoid-break-after">Individual Keywords</div><div class="table-responsive table-part"><table class="table table-row-dashed table-fluid">            <thead>                <tr><th style="width:20%">Keyword</th>                <th style="width:15%">Title</th>                <th style="width:15%">Meta Description Tag</th>                <th style="width:15%">Headings Tags</th>                <th style="width:15%">Page Frequency</th>                <th style="width:20%"></th>            </tr></thead>            <tbody>            <tr>                <td>kommentify</td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td>21</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 100%;"></span></div></td>            </tr>            <tr>                <td>linkedin</td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td>19</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 90%;"></span></div></td>            </tr>            <tr>                <td>automation</td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>13</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 62%;"></span></div></td>            </tr>            <tr>                <td>posts</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>9</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 43%;"></span></div></td>            </tr>            <tr>                <td>import</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>8</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 38%;"></span></div></td>            </tr>            <tr>                <td>lifetime</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>7</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 33%;"></span></div></td>            </tr>            <tr>                <td>growth</td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td>7</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 33%;"></span></div></td>            </tr>            <tr>                <td>features</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>6</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 29%;"></span></div></td>            </tr></tbody></table></div></div><div class="answer phrases field-details field-value-table avoid-break-inside">        <div class="fs-2 my-4 text-center text-gray-700 avoid-break-after">Phrases</div><div class="table-responsive table-part"><table class="table table-row-dashed table-fluid">            <thead>                <tr><th style="width:20%">Phrase</th>                <th style="width:15%">Title</th>                <th style="width:15%">Meta Description Tag</th>                <th style="width:15%">Headings Tags</th>                <th style="width:15%">Page Frequency</th>                <th style="width:20%"></th>            </tr></thead>            <tbody>            <tr>                <td>lifetime deal</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>5</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 100%;"></span></div></td>            </tr>            <tr>                <td>linkedin growth</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td>                <td>5</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 100%;"></span></div></td>            </tr>            <tr>                <td>free trial</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>4</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 80%;"></span></div></td>            </tr>            <tr>                <td>start free</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>3</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 60%;"></span></div></td>            </tr>            <tr>                <td>processing stop</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>3</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 60%;"></span></div></td>            </tr>            <tr>                <td>content creation</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>3</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 60%;"></span></div></td>            </tr>            <tr>                <td>start free trial</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>3</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 60%;"></span></div></td>            </tr>            <tr>                <td>get started</td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td>                <td>2</td>                <td class="volume-bar-wrapper min-w-100px"><div><span style="width: 40%;"></span></div></td>            </tr></tbody></table></div></div></div>            
        <div class="check-info" style="display: none"><p class="what">Generally a page should be targeted to rank for particular set of keywords or phrases. These keywords should be used with some consistency in page content (naturally and without stuffing) to maximize ranking potential for those keywords. This means these keywords should be present across the most important HTML Tags of the page, and used with some frequency in the general page text content. The keyword consistency check illustrates the keywords we have identified appearing most frequently in these areas.</p><p class="how">If the keywords and phrases identified don't match your intended ranking keywords, and do not show a level of consistency, you should consider amending your core page content to better include these.</p><p class="more-info"><a href="/blog/keyword-consistency/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group">
        <div class="faq-box row-hidden field-targetUsage">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword Consistency</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div>            
        </div><div class="faq-box row-hidden field-targetUsage" id="targetUsage62508487">
            <div class="avoid-break-inside"><div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword Consistency</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            </div>            
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-contentCount tr-always-border">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Amount of Content</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-contentCount tr-always-border expandable" id="contentCount62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Amount of Content</h5>
                    <div class="answer field-value">Your page has a good level of textual content, which will assist in it's ranking potential.<br>
                    <div class="row mt-4">
                        <div class="col-xl-6">
                            <table class="table table-row-dashed">
                                <tbody>
                                    <tr>
                                        <td>Word Count: 933</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">Numerous studies have shown that there is a relationship between the amount of content on a page (typically measured in word count) and it's ranking potential - generally longer content will rank higher. Obviously content also needs to be topically relevant, keyword rich and highly readable for the visitor. Note, in our assessment, we look at all selectable text on the page at load time, not hidden content.</p><p class="how">As a general guideline, it is recommended to have atleast 500 words of content on a page to give it some ranking potential. However this should be considered on a case by case basis. It may not be relevant for particular pages like 'contact us' pages for example.</p><p class="more-info"><a href="/blog/content-length/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasImageWithoutAlt">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Image Alt Attributes</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-hasImageWithoutAlt expandable" id="hasImageWithoutAlt62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Image Alt Attributes</h5>
                    <div class="answer field-value">You do not have any images missing Alt Attributes on your page.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        <div class="check-info" style="display: none"><p class="what">Alternate Image Text or Alt Text is descriptive text that is displayed in place of an image if it can't be loaded, as well as a label on an image when it is moused over in the browser, to give more information to the visitor. Additionally, Search Engines use provided Alt Text to better understand the content of an image. Image SEO is not widely known, but having your image rank for image searches is an overlooked way of gaining traffic and backlinks to your site.</p><p class="how">We recommend adding useful and keyword rich Alt Text for pages's main images, in particular those that could have ranking potential. This should be considered on a case-by-case basis. Often there may be imagery such as UI components or tracking pixels where it may not be useful to add Alt Text, though we have tried to filter a number of these out in our analysis.</p><p class="more-info"><a href="/blog/alt-attribute/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group">
        <div class="faq-box row-hidden field-targetAlt">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword in Image Alt Attributes</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-targetAlt" id="targetAlt62508487">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Target Keyword in Image Alt Attributes</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        <div class="check-info" style="display: none"></div></div>
    </div>                                <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-canonicalCheck avoid-break-inside tr-always-border">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Canonical Tag</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"></div>            
        </div><div class="faq-box row-hidden field-canonicalCheck avoid-break-inside tr-always-border expandable" id="canonicalCheck62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Canonical Tag</h5>
                    <div class="answer field-value">Your page is using the Canonical Tag.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"><div class="table-responsive col-xl-6 mt-4"><table class="table table-row-dashed table-fluid mb-0"><tbody><tr><td>https://kommentify.com</td></tr></tbody></table></div></div>            
        <div class="check-info" style="display: none"><p class="what">The Canonical Tag is a HTML Tag that tells Search Engines the primary URL of a page. URLs can have multiple versions due to things like parameters being passed or www and non-www versions, resulting in potential duplicate content. Google recommends all pages specify a Canonical for this reason.</p><p class="how">You may need to determine what the primary preferred version of the page is. Often the CMS may manage this, or provide the ability to specify it.</p><p class="more-info"><a href="/blog/canonical-url/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasNoindexTags avoid-break-inside">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Noindex Tag Test</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-hasNoindexTags avoid-break-inside expandable" id="hasNoindexTags62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Noindex Tag Test</h5>
                    <div class="answer field-value">Your page is not using the Noindex Tag which prevents indexing.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">A critical part of a page's ranking potential is ensuring that it can actually be accessed by Search Engines. The Noindex Tag, when used on pages, tells Search Engines to ignore a page, and can destroy out it's ranking ability. Sometimes these tags are added intentionally for low value pages, but sometimes they are left over unintentionally from a theme or template that has been used on the site, or forgotten to be removed by a developer when a website moves from design and testing to live usage.</p><p class="how">If you want the page to rank and it's using a Noindex Tag, you will need to remove the tag from your page's HTML entirely. This may require access to the frontend HTML code, and may need to be done by a developer. If you are using a CMS, you may have an option enabled to prevent indexing of the page, which should be turned off.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasNoindexHeaders avoid-break-inside">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Noindex Header Test</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-hasNoindexHeaders avoid-break-inside expandable" id="hasNoindexHeaders62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Noindex Header Test</h5>
                    <div class="answer field-value">Your page is not using the Noindex Header which prevents indexing.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">A critical part of a page's ranking potential is ensuring that it can actually be accessed by Search Engines. The Noindex Header is another Noindexing method that tells Search Engines to ignore a page, and can destroy out it's ranking ability. Sometimes these tags are added intentionally for low value pages, but sometimes they are left over unintentionally from a theme or template that has been used on the site, or forgotten to be removed by a developer when a website moves from design and testing to live usage.</p><p class="how">If you want the page to rank and it's using a Noindex Header, you will need to remove the Noindex Header from your page. This may require access to the backend code, and may need to be done by a developer. If you are using a CMS, you may have an option enabled to prevent indexing of the page, which should be turned off.</p></div></div>
    </div>                                <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasSsl ">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">SSL Enabled</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-hasSsl expandable" id="hasSsl62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">SSL Enabled</h5>
                    <div class="answer field-value">Your website has SSL enabled.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">SSL or Secure Socket Layer, is a security technology that encrypts data between your website and a visitor. It ensures that the transfer of sensitive data like passwords and credit cards are done securely. Using SSL on all pages is a modern standard, and Search Engines have made it a ranking signal in recent years.</p><p class="how">SSL can often be switched on quite simply in systems like Wordpress, Wix etc. Often in more custom websites though, it may require the help of a technical resource to install and configure this on your website. After installation, test that your website loads successfully at a HTTPS:// location.</p><p class="more-info"><a href="/blog/ssl/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasHttpsRedirect ">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">HTTPS Redirect</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-hasHttpsRedirect expandable" id="hasHttpsRedirect62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">HTTPS Redirect</h5>
                    <div class="answer field-value">Your page successfully redirects to a HTTPS (SSL secure) version.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">SSL is a security technology which ensures sensitive data like passwords and credit cards are sent securely between your website and visitors. If you have SSL enabled, it is also very important to ensure that your page is actually forcing usage of HTTPS by redirecting from a non-secure HTTP version to secure HTTPS version. Not doing this means users and Search Engines may continue to access insecure versions, which can also reduce your ranking ability.</p><p class="how">Often systems like Wix or Shopify will make it easy to enable, and redirect to SSL versions. If you have Wordpress, or a custom built site, you may require a developer's involvement to ensure that pages are being redirected to their new HTTPS versions. This can be done within a site's configuration or htaccess rules.</p><p class="more-info"><a href="/blog/ssl/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasRobotsTxt avoid-break-inside tr-always-border">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Robots.txt</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"></div>            
        </div><div class="faq-box row-hidden field-hasRobotsTxt avoid-break-inside tr-always-border expandable" id="hasRobotsTxt62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Robots.txt</h5>
                    <div class="answer field-value">Your website appears to have a robots.txt file.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"><div class="table-responsive col-xl-6 mt-4 table-part"><table class="table table-row-dashed table-fluid"><tbody><tr><td>http://kommentify.com/robots.txt</td></tr></tbody></table></div></div>            
        <div class="check-info" style="display: none"><p class="what">Robots.txt is a text file that provides instructions to Search Engine crawlers on how to crawl your site, including types of pages to access or not access. It is often the gatekeeper of your site, and normally the first thing a Search Engine bot will access.</p><p class="how">We recommend always having a robots file in place for your site. These can be automatically created using a free online utility, Wordpress plugin, or your CMS's robots.txt creation process.</p><p class="more-info"><a href="/blog/robots-txt/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-blockedByRobotsTxt avoid-break-inside">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Blocked by Robots.txt</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-blockedByRobotsTxt avoid-break-inside expandable" id="blockedByRobotsTxt62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Blocked by Robots.txt</h5>
                    <div class="answer field-value">Your page does not appear to be blocked by robots.txt.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">The robots.txt file includes important instructions to Search Engines on how to crawl a site, including instructions to ignore particular pages (effectively 'blocking' them). Sometimes these instructions are added intentionally for low value pages, but sometimes they are left over by mistake when a website goes live, or can be written incorrectly excluding more pages than desired.</p><p class="how">If you want the page to rank and it's blocked by a rule in robots.txt, you may need to review your robots rules to understand why it's being blocked, and remove the rule. Because robots.txt instructions are a type of code, this may require the help of a developer to correct.</p><p class="more-info"><a href="/blog/robots-txt/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasLlmsTxt avoid-break-inside tr-always-border">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Llms.txt</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"></div>            
        </div><div class="faq-box row-hidden field-hasLlmsTxt avoid-break-inside tr-always-border expandable" id="hasLlmsTxt62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Llms.txt</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>
                    <div class="answer field-value">We have not detected or been able to retrieve a llms.txt file successfully.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"></div>            
        <div class="check-info" style="display: none"><p class="what">Llms.txt is a proposed standard file for websites to help large language model (LLM) crawlers understand a site's content more efficiently. The file offers brief background information, guidance, and links to documentation sources.</p><p class="how">We suggest adding a llms.txt markdown file to your site. This can be automatically created with a free utility, plugin, or by your website CMS automatically.</p><p class="more-info"><a href="/blog/llms-txt/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasSitemap avoid-break-inside tr-always-border">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">XML Sitemaps</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"></div>            
        </div><div class="faq-box row-hidden field-hasSitemap avoid-break-inside tr-always-border expandable" id="hasSitemap62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">XML Sitemaps</h5>
                    <div class="answer field-value">Your website appears to have an XML Sitemap.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"><div class="table-responsive table-part col-xl-6 mt-4"><table class="table table-row-dashed table-fluid table-wrapped"><tbody><tr><td>https://kommentify.com/sitemap.xml</td></tr></tbody></table></div></div>            
        <div class="check-info" style="display: none"><p class="what">A Sitemap is an XML data file on your site that lists all of your site's pages that are available for crawling together with other useful information like last update times and crawling priority. Sitemap files help Search Engines find all your pages to give them the highest chance of being indexed and ranked.</p><p class="how">We recommend always having a Sitemaps file in place for your site. Sitemaps can be created manually using a utility, Wordpress plugin, or your CMS's Sitemap creation process. Additionally, the Sitemap should be referenced in your robots.txt file.</p><p class="more-info"><a href="/blog/sitemap/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasAnalytics avoid-break-inside tr-always-border">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Analytics</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"></div>            
        </div><div class="faq-box row-hidden field-hasAnalytics avoid-break-inside tr-always-border expandable" id="hasAnalytics62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Analytics</h5>
                    <div class="answer field-value">We could not detect an analytics tool installed on your page.<div class="append2">Website analytics tools like Google Analytics assist you in measuring, analyzing and ultimately improving traffic to your page.</div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"></div>            
        <div class="check-info" style="display: none"><p class="what">Web Analytics Tools like Google Analytics allow you to analyze your website’s performance and understand your visitors better. </p><p class="how">We recommend using an analytics tool on your site. Analytics tracking code can be installed manually into page code with the help of a developer or enabled as a feature of your CMS.</p><p class="more-info"><a href="/blog/why-web-analytics-tools-are-important-for-your-website/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasSchemaOrg avoid-break-inside">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Schema.org Structured Data</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-hasSchemaOrg avoid-break-inside expandable" id="hasSchemaOrg62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Schema.org Structured Data</h5>
                    <div class="answer field-value">You are using JSON-LD Schema on your page.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">Schema.org Structured Data Markup is a collection of data tags that can be added to your site to allow Search Engines to more easily interpret the content and use it to enhance Search Results. For example there are tags for providing information about your Local Business such as address and phone number, or adding product information on e-commerce pages so that these products can be displayed in shopping aggregators like Google Shopping.</p><p class="how">It is a good idea to start incorporating some relevant Schema.org tags into your site to improve interpretation and display by Search Engines.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-identitySchema avoid-break-inside tr-always-border">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Identity Schema</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"></div>            
        </div><div class="faq-box row-hidden field-identitySchema avoid-break-inside tr-always-border expandable" id="identitySchema62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Identity Schema</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>
                    <div class="answer field-value">Organization or Person Schema identified on the page.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="answer field-value-table"><div class="row mt-4"><div class="gm-profile-info col-xl-6"><table class="table table-row-dashed table-fluid table-wrapped mb-0"><tbody><tr><td>Organization</td></tr></tbody></table></div></div></div>            
        <div class="check-info" style="display: none"><p class="what">Organization and Person Schema is a type of Structured Data that helps clearly signal to Search Engines and LLMs 'who you are'. This helps them to more confidently answer brand, company or person queries, recommend your services and avoid mixups with similarly named people or organizations.</p><p class="how">The approach for adding Organization or Person Schema depends on your website's capabilities. Your CMS may have the ability to input this directly, or you may need to install a Schema app or plugin. Alternatively you can manually create your Schema through the use of an online Schema Generator tool and copy this into the code of your site.</p><p class="more-info"><a href="/blog/schema-markup-for-ai-search/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-llmReadability avoid-break-inside tr-always-border">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Rendered Content (LLM Readability)</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-llmReadability avoid-break-inside tr-always-border expandable" id="llmReadability62508487" style="display: block;">
            <div class="js-header-place"></div> 
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Rendered Content (LLM Readability)</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>
                    <div class="answer field-value">Your page has a low level of rendered content which tends to make it more readable for LLMs.<br>
                    <div class="row mt-4">
                        <div class="col-xl-6">
                            <table class="table table-row-dashed">
                                <tbody>
                                    <tr>
                                        <td>Rendering Percentage: 9%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">LLMs and AI Crawlers predominantly read the raw HTML of a website instead of the completed, dynamically rendered HTML produced in a web-browser, that may have been updated by Javascript. This stems from LLMs being naturally optimized to parse static content like documents and files as well as the fact that rendering website Javascript at scale is expensive, slow, and can be less consistent.</p><p class="how">You should ensure that important site content is always present in the raw HTML of your site and minimize the usage of plugins and Javascript components known to add content dynamically. This requires a moderate technical understanding to achieve and test.</p></div></div>
    </div>                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

                        <div class="row g-5 gx-xl-10 mb-5 mb-xl-10 tab-rankings container-check" style="">
    <div class="col-xxl-12 position-relative" id="rankings">
        <div class="portlet card card-flush">
            <div class="portlet-heading js-header-container avoid-break-inside card-header pt-7">
                <h2 class="section-title align-items-start flex-column">
                    <span class="fw-bold">
                        Rankings                     </span>
                </h2>
            </div>
            <div class="portlet-body card-body pt-6">
                                <div class="row-hidden check-group">
                    <div class="faq-box total-traffic field-totalTrafficFromSearch row-hidden">
                        <div class="avoid-break-inside">
                            <div class="js-header-place"></div>
                            <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Traffic From Search</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>                            <div class="answer field-value"></div>
                        </div>
                        <div class="field-details"></div>
                    </div><div class="faq-box total-traffic field-totalTrafficFromSearch row-hidden" id="totalTrafficFromSearch62508487">
                        <div class="avoid-break-inside">
                            <div class="js-header-place"></div>
                            <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Traffic From Search</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>                            <div class="answer field-value"></div>
                        </div>
                        <div class="field-details"></div>
                    <div class="check-info" style="display: none"></div></div>
                </div>
                                <div class="row-hidden check-group" style="display: block;">
                    <div class="faq-box row-hidden top-ranked field-topKeywordRankings mb-3">
                        <div class="avoid-break-inside">
                            <div class="js-header-place"></div>
                            <div class="row avoid-break-inside">
                                <div class="col-sm-12">
                                    <h5 class="question d-inline-block me-3">Top Organic Keyword Rankings</h5>                                    <div class="answer field-value"></div>
                                </div>
                            </div>
                            <div class="field-value-table mt-5 table-responsive"></div>
                                                    </div>
                    </div><div class="faq-box row-hidden top-ranked field-topKeywordRankings mb-3 expandable" id="topKeywordRankings62508487" style="display: block;">
                        <div class="avoid-break-inside">
                            <div class="js-header-place"></div>
                            <div class="row avoid-break-inside">
                                <div class="col-sm-12">
                                    <h5 class="question d-inline-block me-3">Top Organic Keyword Rankings</h5>                                    <div class="answer field-value">You can see the live Keyword Rankings for your page within the report by signing up to one of our premium plans.<div class="append2"><a class="btn btn-primary btn-sm btn-report-signup" href="/register" target="_blank">Signup - Free Trial</a></div></div>
                                </div>
                            </div>
                            <div class="field-value-table mt-5 table-responsive"></div>
                                                    </div>
                    <div class="check-info" style="display: none"><p class="what">A goal of Search Engine Optimization is to improve the ranking of your website for particular keywords to drive more clicks and traffic to your site. The Top Organic Keyword Rankings check shows you the keywords that your site is currently ranking for in the normal '10 blue links' organic segment of a Google search result, ordered by those that are likely driving the most traffic to your site. Note this data is a snapshot and may be several weeks old in some cases.</p></div></div>
                </div>
                                <div class="row-hidden check-group">
                    <div class="faq-box row-hidden paid-ranking field-topPaidRankings mb-3">
                        <div class="avoid-break-inside">
                            <div class="js-header-place"></div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <h5 class="question d-inline-block me-3">Top Paid Keyword Rankings</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>                                    <div class="answer field-value"></div>
                                </div>
                            </div>
                            <div class="field-value-table mt-5 table-responsive"></div>
                        </div>
                    </div><div class="faq-box row-hidden paid-ranking field-topPaidRankings mb-3" id="topPaidRankings62508487">
                        <div class="avoid-break-inside">
                            <div class="js-header-place"></div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <h5 class="question d-inline-block me-3">Top Paid Keyword Rankings</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>                                    <div class="answer field-value"></div>
                                </div>
                            </div>
                            <div class="field-value-table mt-5 table-responsive"></div>
                        </div>
                    <div class="check-info" style="display: none"></div></div>
                </div>
                                <div class="row-hidden check-group">
                    <div class="faq-box row-hidden ai-overview field-topAIOverviewRankings mb-3">
                        <div class="avoid-break-inside">
                            <div class="js-header-place"></div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <h5 class="question d-inline-block me-3">Top AI Overview Citations</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>                                    <div class="answer field-value"></div>
                                </div>
                            </div>
                            <div class="field-value-table mt-5 table-responsive"></div>
                        </div>
                    </div><div class="faq-box row-hidden ai-overview field-topAIOverviewRankings mb-3" id="topAIOverviewRankings62508487">
                        <div class="avoid-break-inside">
                            <div class="js-header-place"></div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <h5 class="question d-inline-block me-3">Top AI Overview Citations</h5><span class="badge check-badge badge-light-success mb-2 align-top">New</span>                                    <div class="answer field-value"></div>
                                </div>
                            </div>
                            <div class="field-value-table mt-5 table-responsive"></div>
                        </div>
                    <div class="check-info" style="display: none"></div></div>
                </div>
                                <div class="row-hidden check-group">
                    <div class="faq-box avoid-break-inside keyword-positions field-keywordPositions row-hidden">
                        <div class="js-header-place"></div>
                        <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Organic Keyword Positions</h5>                        <div class="answer field-value"></div>
                        <div class="row m-0 mt-4">
                            <div class="table-responsive col-xl-6 field-value-table">
                                <table class="total-estimated-table table table-row-dashed table-fluid">
                                    <thead>
                                        <tr>
                                            <th>Position</th>
                                            <th>Keywords</th>
                                            <th style="min-width: 130px"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="positions-table"></tbody>
                                </table>
                            </div>
                        </div>
                    </div><div class="faq-box avoid-break-inside keyword-positions field-keywordPositions row-hidden" id="keywordPositions62508487">
                        <div class="js-header-place"></div>
                        <h5 class="question d-inline-block me-3" data-wow-delay=".1s">Organic Keyword Positions</h5>                        <div class="answer field-value"></div>
                        <div class="row m-0 mt-4">
                            <div class="table-responsive col-xl-6 field-value-table">
                                <table class="total-estimated-table table table-row-dashed table-fluid">
                                    <thead>
                                        <tr>
                                            <th>Position</th>
                                            <th>Keywords</th>
                                            <th style="min-width: 130px"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="positions-table"></tbody>
                                </table>
                            </div>
                        </div>
                    <div class="check-info" style="display: none"></div></div>
                </div>
            </div>
        </div>
    </div>
</div>

                        <div class="row g-5 gx-xl-10 mb-5 mb-xl-10 container-check block tab-links" style="">
    <div class="col-xxl-12 position-relative" id="links">
        <div class="portlet card card-flush">
            <div class="portlet-heading card-header pt-7 js-header-container avoid-break-inside border-bottom-0">
                <h2 class="section-title align-items-start flex-column">
                    <span class="fw-bold">
                        Links                    </span>
                </h2>
            </div>
            <div class="portlet-body card-body pt-6">
                <!-- Backlinks -->
                    <!-- Elements for calculating width of charts -->
    <div class="row">
        <div class="col-12 col-sm-6 col-pdf-6" id="links-chart-sizer"></div>
    </div>
    <div style="padding: 0 36px">
        <div class="row">
            <div class="col-12 col-sm-6 col-pdf-6" id="links-competitor-chart-sizer"></div>
        </div>
    </div>
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden backlink-summary field-backlinks">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Backlink Summary</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        </div><div class="faq-box row-hidden backlink-summary field-backlinks expandable" id="backlinks62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Backlink Summary</h5>
                        <div class="answer field-value">You have a reasonably weak level of backlink activity to this page.<div class="append2">Search Engines use backlinks as a strong indicator of a page's authority, relevance and ranking potential. There are various strategies available to gain links to a page to improve this factor</div></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"><div class="backlink-summary avoid-break-inside backlink-summary-score d-inline-block" align="center"><div class="backlink-summary-score-item d-inline-block" style="width:128px">            <div style="width: 128px; visibility: visible; min-height: 129px;" class="text-center backlink-domain-score-62508487" data-width="128" data-height="128" data-fgcolor="danger" data-font-size="20px" data-label="1" data-value="1" data-color="danger"><div id="apexchartsgjz0mwe7" class="apexcharts-canvas apexchartsgjz0mwe7 apexcharts-theme-light" style="width: 128px; height: 129px;"><svg id="SvgjsSvg9648" width="128" height="129" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="128" height="129"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9650" class="apexcharts-inner apexcharts-graphical" transform="translate(0, 1)"><defs id="SvgjsDefs9649"><clipPath id="gridRectMaskgjz0mwe7"><rect id="SvgjsRect9651" width="134" height="138" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskgjz0mwe7"></clipPath><clipPath id="nonForecastMaskgjz0mwe7"></clipPath><clipPath id="gridRectMarkerMaskgjz0mwe7"><rect id="SvgjsRect9652" width="132" height="130" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9653" class="apexcharts-radialbar"><g id="SvgjsG9654"><g id="SvgjsG9655" class="apexcharts-tracks"><g id="SvgjsG9656" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367" fill="none" fill-opacity="1" stroke="rgba(255,238,243,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367"></path></g></g><g id="SvgjsG9658"><g id="SvgjsG9662" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9663" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 67.17562093276611 17.586504882683855" fill="none" fill-opacity="0.85" stroke="rgba(248,40,90,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="4" data:value="1" index="0" j="0" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 67.17562093276611 17.586504882683855"></path></g><circle id="SvgjsCircle9659" r="41.8780487804878" cx="64" cy="63" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9660" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9661" font-family="inherit" x="64" y="70" text-anchor="middle" dominant-baseline="auto" font-size="20px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">1</text></g></g></g></g><line id="SvgjsLine9664" x1="0" y1="0" x2="128" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9665" x1="0" y1="0" x2="128" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>            <p class="score_name" style="width:128px">Domain<br>Strength</p>        </div><div class="backlink-summary-score-item d-inline-block" style="width:128px">            <div style="width: 128px; visibility: visible; min-height: 129px;" class="text-center backlink-page-score-62508487" data-width="128" data-height="128" data-fgcolor="danger" data-font-size="20px" data-label="1" data-value="1" data-color="danger"><div id="apexchartslkuwpeyg" class="apexcharts-canvas apexchartslkuwpeyg apexcharts-theme-light" style="width: 128px; height: 129px;"><svg id="SvgjsSvg9666" width="128" height="129" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="128" height="129"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9668" class="apexcharts-inner apexcharts-graphical" transform="translate(0, 1)"><defs id="SvgjsDefs9667"><clipPath id="gridRectMasklkuwpeyg"><rect id="SvgjsRect9669" width="134" height="138" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMasklkuwpeyg"></clipPath><clipPath id="nonForecastMasklkuwpeyg"></clipPath><clipPath id="gridRectMarkerMasklkuwpeyg"><rect id="SvgjsRect9670" width="132" height="130" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9671" class="apexcharts-radialbar"><g id="SvgjsG9672"><g id="SvgjsG9673" class="apexcharts-tracks"><g id="SvgjsG9674" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367" fill="none" fill-opacity="1" stroke="rgba(255,238,243,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 1 1 63.99205449504314 17.47561044947367"></path></g></g><g id="SvgjsG9676"><g id="SvgjsG9680" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9681" d="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 67.17562093276611 17.586504882683855" fill="none" fill-opacity="0.85" stroke="rgba(248,40,90,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="7.29268292682927" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="4" data:value="1" index="0" j="0" data:pathOrig="M 64 17.475609756097562 A 45.52439024390244 45.52439024390244 0 0 1 67.17562093276611 17.586504882683855"></path></g><circle id="SvgjsCircle9677" r="41.8780487804878" cx="64" cy="63" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9678" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9679" font-family="inherit" x="64" y="70" text-anchor="middle" dominant-baseline="auto" font-size="20px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">1</text></g></g></g></g><line id="SvgjsLine9682" x1="0" y1="0" x2="128" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9683" x1="0" y1="0" x2="128" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>            <p class="score_name" style="width:128px">Page<br>Strength</p>        </div></div><div class="competitor-sizer">        <div class="row backlink-summary-down-stats avoid-break-inside mb-5 row-gap-3 row-gap-xl-5 gx-3 gx-xl-5"><div class="col-12 col-sm-6 col-md-5 col-xxl-3 col-pdf-3">                    <div class="card h-lg-100">                        <div class="card-body d-flex justify-content-start align-items-start flex-column py-7 px-9 p-pdf-6">                            <div class="m-0">                                <i class="ki-duotone ki-fasten fs-2hx text-gray-600">                                    <span class="path1"></span>                                    <span class="path2"></span>                                    <span class="path3"></span>                                    <span class="path4"></span>                                    <span class="path5"></span>                                    <span class="path6"></span>                                    <span class="path7"></span>                                </i>                            </div>                            <div class="d-flex flex-column mt-6 mt-pdf-5">                                <span class="fw-semibold fs-2qx fs-pdf-1 text-gray-800 lh-1 ls-n2">21</span>                                <div class="m-0 mt-2 text-wrap">                                    <span class="fw-semibold fs-6 fs-pdf-7 text-gray-500 card-tile-title">Total Backlinks</span>                                </div>                            </div>                        </div>                    </div>                </div><div class="col-12 col-sm-6 col-md-5 col-xxl-3 col-pdf-3">                    <div class="card h-lg-100">                        <div class="card-body d-flex justify-content-start align-items-start flex-column py-7 px-9 p-pdf-6">                            <div class="m-0">                                <i class="ki-duotone ki-exit-right-corner fs-2hx text-gray-600">                                    <span class="path1"></span>                                    <span class="path2"></span>                                    <span class="path3"></span>                                    <span class="path4"></span>                                    <span class="path5"></span>                                    <span class="path6"></span>                                    <span class="path7"></span>                                </i>                            </div>                            <div class="d-flex flex-column mt-6 mt-pdf-5">                                <span class="fw-semibold fs-2qx fs-pdf-1 text-gray-800 lh-1 ls-n2">21</span>                                <div class="m-0 mt-2 text-wrap">                                    <span class="fw-semibold fs-6 fs-pdf-7 text-gray-500 card-tile-title">Referring Domains</span>                                </div>                            </div>                        </div>                    </div>                </div></div><div class="row backlink-summary-down-stats avoid-break-inside row-gap-3 row-gap-xl-5 gx-3 gx-xl-5"><div class="col-12 col-sm-6 col-md-4 col-xxl-2 col-pdf-2">                    <div class="card h-lg-100">                        <div class="card-body d-flex justify-content-start align-items-start flex-column py-7 px-9 p-pdf-6 pb-pdf-5">                            <div class="m-0 pdf-hidden">                                <i class="ki-duotone ki-disconnect fs-2hx text-gray-600">                                    <span class="path1"></span>                                    <span class="path2"></span>                                    <span class="path3"></span>                                    <span class="path4"></span>                                    <span class="path5"></span>                                    <span class="path6"></span>                                    <span class="path7"></span>                                </i>                            </div>                            <div class="d-flex flex-column mt-6 mt-pdf-0">                                <span class="fw-semibold fs-2qx fs-pdf-1 text-gray-800 lh-1 ls-n2">21</span>                                <div class="m-0 mt-2 text-wrap mt-pdf-1 lh-pdf-1_2">                                    <span class="fw-semibold fs-6 fs-pdf-7 text-gray-500 card-tile-title">Nofollow Backlinks</span>                                </div>                            </div>                        </div>                    </div>                </div><div class="col-12 col-sm-6 col-md-4 col-xxl-2 col-pdf-2">                    <div class="card h-lg-100">                        <div class="card-body d-flex justify-content-start align-items-start flex-column py-7 px-9 p-pdf-6 pb-pdf-5">                            <div class="m-0 pdf-hidden"><i class="ki-duotone ki-abstract-49 text-gray-600 fs-2x ms-n1 position-absolute"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>                                <i class="ki-duotone ki-exit-right-corner opacity-0 fs-2hx text-gray-600">                                    <span class="path1"></span>                                    <span class="path2"></span>                                    <span class="path3"></span>                                    <span class="path4"></span>                                    <span class="path5"></span>                                    <span class="path6"></span>                                    <span class="path7"></span>                                </i>                            </div>                            <div class="d-flex flex-column mt-6 mt-pdf-0">                                <span class="fw-semibold fs-2qx fs-pdf-1 text-gray-800 lh-1 ls-n2">0</span>                                <div class="m-0 mt-2 text-wrap mt-pdf-1 lh-pdf-1_2">                                    <span class="fw-semibold fs-6 fs-pdf-7 text-gray-500 card-tile-title">Dofollow Backlinks</span>                                </div>                            </div>                        </div>                    </div>                </div><div class="col-12 col-sm-6 col-md-4 col-xxl-2 col-pdf-2">                    <div class="card h-lg-100">                        <div class="card-body d-flex justify-content-start align-items-start flex-column py-7 px-9 p-pdf-6 pb-pdf-5">                            <div class="m-0 pdf-hidden">                                <i class="ki-duotone ki-teacher fs-2hx text-gray-600">                                    <span class="path1"></span>                                    <span class="path2"></span>                                    <span class="path3"></span>                                    <span class="path4"></span>                                    <span class="path5"></span>                                    <span class="path6"></span>                                    <span class="path7"></span>                                </i>                            </div>                            <div class="d-flex flex-column mt-6 mt-pdf-0">                                <span class="fw-semibold fs-2qx fs-pdf-1 text-gray-800 lh-1 ls-n2">0</span>                                <div class="m-0 mt-2 text-wrap mt-pdf-1 lh-pdf-1_2">                                    <span class="fw-semibold fs-6 fs-pdf-7 text-gray-500 card-tile-title">Edu Backlinks</span>                                </div>                            </div>                        </div>                    </div>                </div><div class="col-12 col-sm-6 col-md-4 col-xxl-2 col-pdf-2">                    <div class="card h-lg-100">                        <div class="card-body d-flex justify-content-start align-items-start flex-column py-7 px-9 p-pdf-6 pb-pdf-5">                            <div class="m-0 pdf-hidden">                                <i class="ki-duotone ki-flag fs-2hx text-gray-600">                                    <span class="path1"></span>                                    <span class="path2"></span>                                    <span class="path3"></span>                                    <span class="path4"></span>                                    <span class="path5"></span>                                    <span class="path6"></span>                                    <span class="path7"></span>                                </i>                            </div>                            <div class="d-flex flex-column mt-6 mt-pdf-0">                                <span class="fw-semibold fs-2qx fs-pdf-1 text-gray-800 lh-1 ls-n2">0</span>                                <div class="m-0 mt-2 text-wrap mt-pdf-1 lh-pdf-1_2">                                    <span class="fw-semibold fs-6 fs-pdf-7 text-gray-500 card-tile-title">Gov Backlinks</span>                                </div>                            </div>                        </div>                    </div>                </div><div class="col-12 col-sm-6 col-md-4 col-xxl-2 col-pdf-2">                    <div class="card h-lg-100">                        <div class="card-body d-flex justify-content-start align-items-start flex-column py-7 px-9 p-pdf-6 pb-pdf-5">                            <div class="m-0 pdf-hidden">                                <i class="ki-duotone ki-abstract-26 fs-2hx text-gray-600">                                    <span class="path1"></span>                                    <span class="path2"></span>                                    <span class="path3"></span>                                    <span class="path4"></span>                                    <span class="path5"></span>                                    <span class="path6"></span>                                    <span class="path7"></span>                                </i>                            </div>                            <div class="d-flex flex-column mt-6 mt-pdf-0">                                <span class="fw-semibold fs-2qx fs-pdf-1 text-gray-800 lh-1 ls-n2">2</span>                                <div class="m-0 mt-2 text-wrap mt-pdf-1 lh-pdf-1_2">                                    <span class="fw-semibold fs-6 fs-pdf-7 text-gray-500 card-tile-title">IPs</span>                                </div>                            </div>                        </div>                    </div>                </div><div class="col-12 col-sm-6 col-md-4 col-xxl-2 col-pdf-2">                    <div class="card h-lg-100">                        <div class="card-body d-flex justify-content-start align-items-start flex-column py-7 px-9 p-pdf-6 pb-pdf-5">                            <div class="m-0 pdf-hidden">                                <i class="ki-duotone ki-screen fs-2hx text-gray-600">                                    <span class="path1"></span>                                    <span class="path2"></span>                                    <span class="path3"></span>                                    <span class="path4"></span>                                    <span class="path5"></span>                                    <span class="path6"></span>                                    <span class="path7"></span>                                </i>                            </div>                            <div class="d-flex flex-column mt-6 mt-pdf-0">                                <span class="fw-semibold fs-2qx fs-pdf-1 text-gray-800 lh-1 ls-n2">2</span>                                <div class="m-0 mt-2 text-wrap mt-pdf-1 lh-pdf-1_2">                                    <span class="fw-semibold fs-6 fs-pdf-7 text-gray-500 card-tile-title">Subnets</span>                                </div>                            </div>                        </div>                    </div>                </div></div></div></div>
        <div class="check-info" style="display: none"><p class="what">Backlinks are links to your site from another site. Search Engines can see these interconnections and use them as a strong signal of the importance and authority of your page or content. Backlinks are one of the most important ranking factors, and in general, more links from authoritative websites will improve the ranking ability of your site. Building Backlinks can be a difficult and time consuming activity, though the rewards are large when done successfully.</p><p class="how">We recommend having a strategy in place for Building Backlinks to your site. Some common methods including adding your site to relevant online directories, asking other sites to link to you, performing outreach and guest blogging on other websites or creating 'lead magnet' content that encourages linking.</p><p class="more-info"><a href="/blog/backlinks/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden backlinks-list field-backlinksList">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Backlinks</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        </div><div class="faq-box row-hidden backlinks-list field-backlinksList expandable" id="backlinksList62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Backlinks</h5>
                        <div class="answer field-value">These are the highest value external pages we have found linking to your site.</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"><div class="table-part table-responsive">
           <table class="table table-row-dashed top-backlinks-table">
               <thead>
                  <tr>
                     <th width="5%">Domain<br>strength</th>
                     <th width="35%" class="top-backlinks-ref-url-cell">Referring Page URL</th>
                     <th width="30%" class="hidden-pdf">Referring Page Title</th>
                     <th width="30%" class="hidden-pdf">Anchor Text</th>
                 </tr>
               </thead>
               <tbody>
<tr><td>65</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://urls-shortener.eu/share/43551">https://urls-shortener.eu/share/43551</span></td><td class="hidden-pdf">❤️ URL Shared ❤️</td><td class="hidden-pdf">kommentify.com</td></tr><tr><td>63</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://quero.party/report/43551">https://quero.party/report/43551</span></td><td class="hidden-pdf">👲 Domain Report 👲</td><td class="hidden-pdf">kommentify.com</td></tr><tr><td>61</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://bye.fyi/report/43551">https://bye.fyi/report/43551</span></td><td class="hidden-pdf">👲 Domain Report 👲</td><td class="hidden-pdf">kommentify.com</td></tr><tr><td>61</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://drjack.world/report/43551">https://drjack.world/report/43551</span></td><td class="hidden-pdf">👲 Domain Report 👲</td><td class="hidden-pdf">kommentify.com</td></tr><tr><td>56</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://atomizelink.icu/report/43551">https://atomizelink.icu/report/43551</span></td><td class="hidden-pdf">👲 Domain Report 👲</td><td class="hidden-pdf">kommentify.com</td></tr><tr><td>55</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://backlinks-checker.com/share/43551">https://backlinks-checker.com/share/43551</span></td><td class="hidden-pdf">❤️ URL Shared ❤️</td><td class="hidden-pdf">kommentify.com</td></tr><tr><td>54</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://shortenurls.eu/share/43551">https://shortenurls.eu/share/43551</span></td><td class="hidden-pdf">❤️ URL Shared ❤️</td><td class="hidden-pdf">kommentify.com</td></tr><tr><td>54</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://byteshort.xyz/report/43551">https://byteshort.xyz/report/43551</span></td><td class="hidden-pdf">👲 Domain Report 👲</td><td class="hidden-pdf">kommentify.com</td></tr><tr><td>54</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://anchorurl.cloud/share/43551">https://anchorurl.cloud/share/43551</span></td><td class="hidden-pdf">❤️ URL Shared ❤️</td><td class="hidden-pdf">kommentify.com</td></tr><tr><td>53</td><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://metamagic.top/stats/43551">https://metamagic.top/stats/43551</span></td><td class="hidden-pdf">✅ Website Stats 📊</td><td class="hidden-pdf">kommentify.com</td></tr></tbody></table></div></div>
        <div class="check-info" style="display: none"><p class="what">Backlinks from higher authority websites generally deliver the best ranking potential to your site. This report provides a sample of some of the highest value backlinks we can see linking to your site.</p><p class="more-info"><a href="/blog/backlinks/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden backlinks-top-pages field-backlinksTopPages">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Pages by Backlinks</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        </div><div class="faq-box row-hidden backlinks-top-pages field-backlinksTopPages expandable" id="backlinksTopPages62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Pages by Backlinks</h5>
                        <div class="answer field-value">These are the pages on your site with the most the backlinks from other sites.</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"><div class="table-part table-responsive">
           <table class="table table-row-dashed" style="width: 100%">
               <thead>
                  <tr>
                     <th style="width: 50%">URL</th>
                     <th style="width: 12%">Backlinks</th>
                     <th style="min-width: 170px"></th>
                 </tr>
               </thead>
               <tbody>
<tr><td class="top-backlinks-ref-url-cell"><span rel="nofollow" href="//https://kommentify.com/">https://kommentify.com/</span></td><td class="no-break-pdf">21</td><td class="volume-bar-wrapper min-w-100px"><div><span style="width: 100%"></span></div></td></tr></tbody></table></div></div>
        <div class="check-info" style="display: none"><p class="what">Your Top Pages with the most Backlinks are likely to drive the most ranking value to your site as well as having a higher potential for themselves ranking.</p><p class="how">Top Pages are useful to consider when making any change to your site (to make sure they don't get removed or are atleast redirected appropriately). They are also useful to consider from a future link building perspective; is there a particular reason these pages are gathering the most links? and do they present any new content ideas for driving further links?</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden backlinks-top-anchors field-backlinksTopAnchors">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Anchors by Backlinks</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        </div><div class="faq-box row-hidden backlinks-top-anchors field-backlinksTopAnchors expandable" id="backlinksTopAnchors62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Anchors by Backlinks</h5>
                        <div class="answer field-value">These are the top pieces of Anchor Text we found used to link to your site.</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"><div class="table-part table-responsive">
           <table class="table table-row-dashed">
               <thead>
                  <tr>
                     <th style="width: 50%">Anchor</th>
                     <th style="width: 12%">Backlinks</th>
                     <th style="min-width: 170px"></th>
                 </tr>
               </thead>
               <tbody>
<tr><td class="top-backlinks-ref-url-cell">kommentify.com</td><td class="no-break-pdf">21</td><td class="volume-bar-wrapper min-w-100px"><div><span style="width: 100%"></span></div></td></tr></tbody></table></div></div>
        <div class="check-info" style="display: none"><p class="what">Anchor Text is the text that is placed inside an A Href HTML tag that links to your site. Anchor Text is a very strong ranking signal that helps Search Engines understand the content of your page and the keywords it should rank for.</p><p class="how">It is important for Anchor Text to be natural and diverse. Having a lot of unnatural Anchor Text can be a strong spam signal for Search Engines. Seeing your Anchor Text can also give you an understanding of how others are talking about your website or service.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden backlinks-top-geographies field-backlinksTopGeographies">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Referring Domain Geographies</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details  top-geographies-container row-hidden mb-4">
            <div class="avoid-break-inside">
                <div class="row mt-5">
                    <div class="col-12 col-xxl-6 col-pdf-6">
                        <div class="avoid-break-inside text-center">
                            <div class="fs-2 my-5 pb-6 pb-sm-3 text-center avoid-break-after">Top TLDs</div>
                            <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                                <div class="position-relative d-flex flex-center h-175px w-175px mb-4 ms-sm-4 ms-11">
                                    <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                        <span class="fw-bolder text-gray-700">&nbsp;</span>
                                        <span class="fs-6 fw-semibold text-gray-500">Referring<br>Domains</span>
                                    </div>
                                    <div class="backlink-top-tlds-chart disable-external-action"></div>
                                </div>
                                <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-200px min-w-xl-250px mw-xl-250px">
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div class="col-12 col-xxl-6 col-pdf-6">
                        <div class="avoid-break-inside text-center">
                            <div class="fs-2 my-5 pb-6 pb-sm-3 text-center avoid-break-after">Top Countries</div>
                            <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                                <div class="position-relative d-flex flex-center h-175px w-175px mb-4 ms-sm-4 ms-11">
                                    <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                        <span class="fw-bolder text-gray-700">&nbsp;</span>
                                        <span class="fw-semibold text-gray-500">Referring<br>Domains</span>
                                    </div>
                                    <div class="backlink-top-countries-chart disable-external-action"></div>
                                </div>
                                <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-200px min-w-xl-250px mw-xl-250px">
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div><div class="field-details top-geographies-container-competitor row-hidden mb-4">
            <div class="avoid-break-inside">
                <div class="row mt-5">
                    <div class="col-12 col-xxl-6 col-pdf-6">
                        <div class="avoid-break-inside text-center">
                            <div class="fs-3 my-5 pb-6 pb-sm-3 text-center avoid-break-after">Top TLDs</div>
                            <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                                <div class="position-relative d-flex flex-center h-175px w-175px mb-4 ms-sm-4 ms-11 me-pdf-5 w-pdf-100">
                                    <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                        <span class="fw-bolder text-gray-700">&nbsp;</span>
                                        <span class="fs-6 fw-semibold text-gray-500">Referring<br>Domains</span>
                                    </div>
                                    <div class="backlink-top-tlds-chart-competitor disable-external-action"></div>
                                </div>
                                <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-200px min-w-xl-250px mw-xl-250px min-w-pdf-220px">
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div class="col-12 col-xxl-6 col-pdf-6">
                        <div class="avoid-break-inside text-center">
                            <div class="fs-3 my-5 pb-6 pb-sm-3 text-center avoid-break-after">Top Countries</div>
                            <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                                <div class="position-relative d-flex flex-center h-175px w-175px mb-4 ms-sm-4 ms-11 me-pdf-5 w-pdf-100">
                                    <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                        <span class="fw-bolder text-gray-700">&nbsp;</span>
                                        <span class="fs-6 fw-semibold text-gray-500">Referring<br>Domains</span>
                                    </div>
                                    <div class="backlink-top-countries-chart-competitor disable-external-action"></div>
                                </div>
                                <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-200px min-w-xl-250px mw-xl-250px min-w-pdf-220px">
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div><div class="faq-box row-hidden backlinks-top-geographies field-backlinksTopGeographies expandable" id="backlinksTopGeographies62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Referring Domain Geographies</h5>
                        <div class="answer field-value">These are the Top Geographies we have found linking to your site.</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details  top-geographies-container row-hidden mb-4" style="display: block;">
            <div class="avoid-break-inside">
                <div class="row mt-5">
                    <div class="col-12 col-xxl-6 col-pdf-6">
                        <div class="avoid-break-inside text-center">
                            <div class="fs-2 my-5 pb-6 pb-sm-3 text-center avoid-break-after">Top TLDs</div>
                            <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                                <div class="position-relative d-flex flex-center h-175px w-175px mb-4 ms-sm-4 ms-11 me-11 me-sm-15">
                                    <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                        <span class="fw-bolder text-gray-700" style="font-size: 25px;">21</span>
                                        <span class="fs-6 fw-semibold text-gray-500 fs-pdf-8">Referring<br>Domains</span>
                                    </div>
                                    <div class="backlink-top-tlds-chart disable-external-action" width="280" height="206" id="backlinksTopGeographies62508487backlink-top-tlds-chart" style="min-height: 212.033px;"><div id="apexchartslqg2r1jh" class="apexcharts-canvas apexchartslqg2r1jh apexcharts-theme-light" style="width: 280px; height: 212.033px;"><svg id="SvgjsSvg9427" width="280" height="212.03333333333333" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="280" height="212.03333333333333"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9429" class="apexcharts-inner apexcharts-graphical" transform="translate(36.33333333333333, 0)"><defs id="SvgjsDefs9428"><clipPath id="gridRectMasklqg2r1jh"><rect id="SvgjsRect9430" width="215.33333333333334" height="243.33333333333334" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMasklqg2r1jh"></clipPath><clipPath id="nonForecastMasklqg2r1jh"></clipPath><clipPath id="gridRectMarkerMasklqg2r1jh"><rect id="SvgjsRect9431" width="213.33333333333334" height="235.33333333333334" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9432" class="apexcharts-pie"><g id="SvgjsG9433" transform="translate(0, 0) scale(1)"><circle id="SvgjsCircle9434" r="72.08536585365854" cx="104.66666666666667" cy="104.66666666666667" fill="transparent"></circle><g id="SvgjsG9435" class="apexcharts-slices"><g id="SvgjsG9436" class="apexcharts-series apexcharts-pie-series" seriesName="top" rel="1" data:realIndex="0"><path id="SvgjsPath9437" d="M 104.66666666666667 8.55284552845528 A 96.11382113821139 96.11382113821139 0 0 1 198.37071364076033 126.05400391245163 L 174.9447018972369 120.70716960100539 A 72.08536585365854 72.08536585365854 0 0 0 104.66666666666667 32.58130081300813 L 104.66666666666667 8.55284552845528 z" fill="rgba(27,132,255,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-0" index="0" j="0" data:angle="102.85714285714286" data:startAngle="0" data:strokeWidth="2" data:value="6" data:pathOrig="M 104.66666666666667 8.55284552845528 A 96.11382113821139 96.11382113821139 0 0 1 198.37071364076033 126.05400391245163 L 174.9447018972369 120.70716960100539 A 72.08536585365854 72.08536585365854 0 0 0 104.66666666666667 32.58130081300813 L 104.66666666666667 8.55284552845528 z" stroke="#ffffff"></path></g><g id="SvgjsG9438" class="apexcharts-series apexcharts-pie-series" seriesName="com" rel="2" data:realIndex="1"><path id="SvgjsPath9439" d="M 198.37071364076033 126.05400391245163 A 96.11382113821139 96.11382113821139 0 0 1 118.99168837995717 199.70697583441847 L 115.41043295163455 175.94689854248054 A 72.08536585365854 72.08536585365854 0 0 0 174.9447018972369 120.70716960100539 L 198.37071364076033 126.05400391245163 z" fill="rgba(23,198,83,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-1" index="0" j="1" data:angle="68.57142857142858" data:startAngle="102.85714285714286" data:strokeWidth="2" data:value="4" data:pathOrig="M 198.37071364076033 126.05400391245163 A 96.11382113821139 96.11382113821139 0 0 1 118.99168837995717 199.70697583441847 L 115.41043295163455 175.94689854248054 A 72.08536585365854 72.08536585365854 0 0 0 174.9447018972369 120.70716960100539 L 198.37071364076033 126.05400391245163 z" stroke="#ffffff"></path></g><g id="SvgjsG9440" class="apexcharts-series apexcharts-pie-series" seriesName="eu" rel="3" data:realIndex="2"><path id="SvgjsPath9441" d="M 118.99168837995717 199.70697583441847 A 96.11382113821139 96.11382113821139 0 0 1 62.96444257034329 191.26222728733657 L 73.38999859442413 169.61333713216908 A 72.08536585365854 72.08536585365854 0 0 0 115.41043295163455 175.94689854248054 L 118.99168837995717 199.70697583441847 z" fill="rgba(13,202,240,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-2" index="0" j="2" data:angle="34.28571428571428" data:startAngle="171.42857142857144" data:strokeWidth="2" data:value="2" data:pathOrig="M 118.99168837995717 199.70697583441847 A 96.11382113821139 96.11382113821139 0 0 1 62.96444257034329 191.26222728733657 L 73.38999859442413 169.61333713216908 A 72.08536585365854 72.08536585365854 0 0 0 115.41043295163455 175.94689854248054 L 118.99168837995717 199.70697583441847 z" stroke="#ffffff"></path></g><g id="SvgjsG9442" class="apexcharts-series apexcharts-pie-series" seriesName="cloud" rel="4" data:realIndex="3"><path id="SvgjsPath9443" d="M 62.96444257034329 191.26222728733657 A 96.11382113821139 96.11382113821139 0 0 1 39.29266580546495 175.12308316074967 L 55.63616602076538 157.5089790372289 A 72.08536585365854 72.08536585365854 0 0 0 73.38999859442413 169.61333713216908 L 62.96444257034329 191.26222728733657 z" fill="rgba(248,40,90,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-3" index="0" j="3" data:angle="17.14285714285714" data:startAngle="205.71428571428572" data:strokeWidth="2" data:value="1" data:pathOrig="M 62.96444257034329 191.26222728733657 A 96.11382113821139 96.11382113821139 0 0 1 39.29266580546495 175.12308316074967 L 55.63616602076538 157.5089790372289 A 72.08536585365854 72.08536585365854 0 0 0 73.38999859442413 169.61333713216908 L 62.96444257034329 191.26222728733657 z" stroke="#ffffff"></path></g><g id="SvgjsG9444" class="apexcharts-series apexcharts-pie-series" seriesName="Other" rel="5" data:realIndex="4"><path id="SvgjsPath9445" d="M 39.29266580546495 175.12308316074967 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 55.63616602076538 157.5089790372289 L 39.29266580546495 175.12308316074967 z" fill="rgba(196,202,218,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-4" index="0" j="4" data:angle="137.14285714285714" data:startAngle="222.85714285714286" data:strokeWidth="2" data:value="8" data:pathOrig="M 39.29266580546495 175.12308316074967 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 55.63616602076538 157.5089790372289 L 39.29266580546495 175.12308316074967 z" stroke="#ffffff"></path></g></g></g></g><line id="SvgjsLine9446" x1="0" y1="0" x2="209.33333333333334" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9447" x1="0" y1="0" x2="209.33333333333334" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg><div class="apexcharts-tooltip apexcharts-theme-dark"><div class="apexcharts-tooltip-series-group" style="order: 1;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(27, 132, 255);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 2;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(23, 198, 83);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 3;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(13, 202, 240);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 4;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(248, 40, 90);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 5;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(196, 202, 218);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div></div></div></div>
                                </div>
                                <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-200px min-w-xl-250px mw-xl-250px">
                                <div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-primary me-3"></div>
<div class="text-gray-500">top</div>
<div class="ms-auto fw-bold text-gray-500">6</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-success me-3"></div>
<div class="text-gray-500">com</div>
<div class="ms-auto fw-bold text-gray-500">4</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-cyan me-3"></div>
<div class="text-gray-500">eu</div>
<div class="ms-auto fw-bold text-gray-500">2</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-danger me-3"></div>
<div class="text-gray-500">cloud</div>
<div class="ms-auto fw-bold text-gray-500">1</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-gray-400 me-3"></div>
<div class="text-gray-500">Other</div>
<div class="ms-auto fw-bold text-gray-500">8</div>
</div></div>
                            </div> 
                        </div>
                    </div>
                    <div class="col-12 col-xxl-6 col-pdf-6">
                        <div class="avoid-break-inside text-center">
                            <div class="fs-2 my-5 pb-6 pb-sm-3 text-center avoid-break-after">Top Countries</div>
                            <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                                <div class="position-relative d-flex flex-center h-175px w-175px mb-4 ms-sm-4 ms-11 me-11 me-sm-15">
                                    <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                        <span class="fw-bolder text-gray-700" style="font-size: 25px;">21</span>
                                        <span class="fw-semibold text-gray-500 fs-6 fs-pdf-8">Referring<br>Domains</span>
                                    </div>
                                    <div class="backlink-top-countries-chart disable-external-action" width="280" height="206" id="backlinksTopGeographies62508487backlink-top-countries-chart" style="min-height: 212.033px;"><div id="apexchartsq4azmudcj" class="apexcharts-canvas apexchartsq4azmudcj apexcharts-theme-light" style="width: 280px; height: 212.033px;"><svg id="SvgjsSvg9412" width="280" height="212.03333333333333" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="280" height="212.03333333333333"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9414" class="apexcharts-inner apexcharts-graphical" transform="translate(36.33333333333333, 0)"><defs id="SvgjsDefs9413"><clipPath id="gridRectMaskq4azmudcj"><rect id="SvgjsRect9415" width="215.33333333333334" height="243.33333333333334" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskq4azmudcj"></clipPath><clipPath id="nonForecastMaskq4azmudcj"></clipPath><clipPath id="gridRectMarkerMaskq4azmudcj"><rect id="SvgjsRect9416" width="213.33333333333334" height="235.33333333333334" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9417" class="apexcharts-pie"><g id="SvgjsG9418" transform="translate(0, 0) scale(1)"><circle id="SvgjsCircle9419" r="72.08536585365854" cx="104.66666666666667" cy="104.66666666666667" fill="transparent"></circle><g id="SvgjsG9420" class="apexcharts-slices"><g id="SvgjsG9421" class="apexcharts-series apexcharts-pie-series" seriesName="FI" rel="1" data:realIndex="0"><path id="SvgjsPath9422" d="M 104.66666666666667 8.55284552845528 A 96.11382113821139 96.11382113821139 0 1 1 76.33662055377468 12.82291292679875 L 83.41913208199767 35.78385136176573 A 72.08536585365854 72.08536585365854 0 1 0 104.66666666666667 32.58130081300813 L 104.66666666666667 8.55284552845528 z" fill="rgba(27,132,255,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-0" index="0" j="0" data:angle="342.85714285714283" data:startAngle="0" data:strokeWidth="2" data:value="20" data:pathOrig="M 104.66666666666667 8.55284552845528 A 96.11382113821139 96.11382113821139 0 1 1 76.33662055377468 12.82291292679875 L 83.41913208199767 35.78385136176573 A 72.08536585365854 72.08536585365854 0 1 0 104.66666666666667 32.58130081300813 L 104.66666666666667 8.55284552845528 z" stroke="#ffffff"></path></g><g id="SvgjsG9423" class="apexcharts-series apexcharts-pie-series" seriesName="CO" rel="2" data:realIndex="1"><path id="SvgjsPath9424" d="M 76.33662055377468 12.82291292679875 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 83.41913208199767 35.78385136176573 L 76.33662055377468 12.82291292679875 z" fill="rgba(23,198,83,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-1" index="0" j="1" data:angle="17.142857142857167" data:startAngle="342.85714285714283" data:strokeWidth="2" data:value="1" data:pathOrig="M 76.33662055377468 12.82291292679875 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 83.41913208199767 35.78385136176573 L 76.33662055377468 12.82291292679875 z" stroke="#ffffff"></path></g></g></g></g><line id="SvgjsLine9425" x1="0" y1="0" x2="209.33333333333334" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9426" x1="0" y1="0" x2="209.33333333333334" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg><div class="apexcharts-tooltip apexcharts-theme-dark"><div class="apexcharts-tooltip-series-group" style="order: 1;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(27, 132, 255);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 2;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(23, 198, 83);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div></div></div></div>
                                </div>
                                <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-200px min-w-xl-250px mw-xl-250px">
                                <div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-primary me-3"></div>
<div class="text-gray-500">FI</div>
<div class="ms-auto fw-bold text-gray-500">20</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-success me-3"></div>
<div class="text-gray-500">CO</div>
<div class="ms-auto fw-bold text-gray-500">1</div>
</div></div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div><div class="field-details top-geographies-container-competitor row-hidden mb-4">
            <div class="avoid-break-inside">
                <div class="row mt-5">
                    <div class="col-12 col-xxl-6 col-pdf-6">
                        <div class="avoid-break-inside text-center">
                            <div class="fs-3 my-5 pb-6 pb-sm-3 text-center avoid-break-after">Top TLDs</div>
                            <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                                <div class="position-relative d-flex flex-center h-175px w-175px mb-4 ms-sm-4 ms-11 me-pdf-5 w-pdf-100">
                                    <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                        <span class="fw-bolder text-gray-700">&nbsp;</span>
                                        <span class="fs-6 fw-semibold text-gray-500">Referring<br>Domains</span>
                                    </div>
                                    <div class="backlink-top-tlds-chart-competitor disable-external-action"></div>
                                </div>
                                <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-200px min-w-xl-250px mw-xl-250px min-w-pdf-220px">
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div class="col-12 col-xxl-6 col-pdf-6">
                        <div class="avoid-break-inside text-center">
                            <div class="fs-3 my-5 pb-6 pb-sm-3 text-center avoid-break-after">Top Countries</div>
                            <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                                <div class="position-relative d-flex flex-center h-175px w-175px mb-4 ms-sm-4 ms-11 me-pdf-5 w-pdf-100">
                                    <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                        <span class="fw-bolder text-gray-700">&nbsp;</span>
                                        <span class="fs-6 fw-semibold text-gray-500">Referring<br>Domains</span>
                                    </div>
                                    <div class="backlink-top-countries-chart-competitor disable-external-action"></div>
                                </div>
                                <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-200px min-w-xl-250px mw-xl-250px min-w-pdf-220px">
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="check-info" style="display: none"><p class="what">Top Geographies are locations found to be linking most frequently to your site in terms of Top Level Domain types (TLDs) and actual physical website server locations.</p><p class="how">Top Geographies are useful for understanding if you are building links in the right places for your business. Many links from an unexpected location could also point to incorrectly targeted or spammy links that could be disavowed.</p></div></div>
    </div>    <div class="row-hidden check-group">
        <div class="faq-box row-hidden field-topReferringDomains">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Referring Domains</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        </div><div class="faq-box row-hidden field-topReferringDomains" id="topReferringDomains62508487">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Top Referring Domains</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-onPageLinks">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">On-Page Link Structure</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="row mb-4 d-none on-page-links-container">
            <div class="col-12 mt-5 mt-xl-0">
                <div class="avoid-break-inside text-center">
                    <div class="fs-2 my-5 pb-6 pb-sm-3 text-center avoid-break-after">On-Page Links</div>
                    <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                        <div class="position-relative d-flex flex-center h-175px w-175px ms-11 mb-4 ms-sm-0">
                            <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                <span class="fw-bolder text-gray-700">&nbsp;</span>
                                <span class="fw-semibold text-gray-500">Total</span>
                            </div>
                            <div class="on-page-links pointer-event" width="100" height="386"></div>
                        </div>
                        <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-300px min-w-xl-250px"></div>
                    </div>
                </div>
            </div>
        </div><div class="field-details"></div>
        </div><div class="faq-box row-hidden field-onPageLinks expandable" id="onPageLinks62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">On-Page Link Structure</h5>
                        <div class="answer field-value">We found 24 total links. 4% of your links are external links and are sending authority to other sites. 0% of your links are nofollow links, meaning authority is not being passed to those destination pages.</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="row mb-4 on-page-links-container">
            <div class="col-12 mt-5 mt-xl-0">
                <div class="avoid-break-inside text-center">
                    <div class="fs-2 my-5 pb-6 pb-sm-3 text-center avoid-break-after">On-Page Links</div>
                    <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                        <div class="position-relative d-flex flex-center h-175px w-175px ms-11 mb-4 ms-sm-0 me-11 me-sm-15">
                            <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                <span class="fw-bolder text-gray-700" style="font-size: 25px;">24</span>
                                <span class="fw-semibold text-gray-500 fs-6 fs-pdf-8">Total</span>
                            </div>
                            <div class="on-page-links pointer-event" width="280" height="206" id="onPageLinks62508487on-page-links" style="min-height: 212.033px;"><div id="apexchartsz7ivir63" class="apexcharts-canvas apexchartsz7ivir63 apexcharts-theme-light" style="width: 280px; height: 212.033px;"><svg id="SvgjsSvg9448" width="280" height="212.03333333333333" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="280" height="212.03333333333333"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9450" class="apexcharts-inner apexcharts-graphical" transform="translate(36.33333333333333, 0)"><defs id="SvgjsDefs9449"><clipPath id="gridRectMaskz7ivir63"><rect id="SvgjsRect9451" width="215.33333333333334" height="243.33333333333334" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskz7ivir63"></clipPath><clipPath id="nonForecastMaskz7ivir63"></clipPath><clipPath id="gridRectMarkerMaskz7ivir63"><rect id="SvgjsRect9452" width="213.33333333333334" height="235.33333333333334" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9453" class="apexcharts-pie"><g id="SvgjsG9454" transform="translate(0, 0) scale(1)"><circle id="SvgjsCircle9455" r="72.08536585365854" cx="104.66666666666667" cy="104.66666666666667" fill="transparent"></circle><g id="SvgjsG9456" class="apexcharts-slices"><g id="SvgjsG9457" class="apexcharts-series apexcharts-pie-series" seriesName="InternalxLinks" rel="1" data:realIndex="0"><path id="SvgjsPath9458" d="M 104.66666666666667 8.55284552845528 A 96.11382113821139 96.11382113821139 0 1 1 79.79057925852034 11.827844565940111 L 86.00960111055693 35.03755009112176 A 72.08536585365854 72.08536585365854 0 1 0 104.66666666666667 32.58130081300813 L 104.66666666666667 8.55284552845528 z" fill="rgba(27,132,255,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-0" index="0" j="0" data:angle="345" data:startAngle="0" data:strokeWidth="2" data:value="23" data:pathOrig="M 104.66666666666667 8.55284552845528 A 96.11382113821139 96.11382113821139 0 1 1 79.79057925852034 11.827844565940111 L 86.00960111055693 35.03755009112176 A 72.08536585365854 72.08536585365854 0 1 0 104.66666666666667 32.58130081300813 L 104.66666666666667 8.55284552845528 z" stroke="#ffffff"></path></g><g id="SvgjsG9459" class="apexcharts-series apexcharts-pie-series" seriesName="ExternalxLinksxxFollow" rel="2" data:realIndex="1"><path id="SvgjsPath9460" d="M 79.79057925852034 11.827844565940111 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 86.00960111055693 35.03755009112176 L 79.79057925852034 11.827844565940111 z" fill="rgba(23,198,83,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-1" index="0" j="1" data:angle="15" data:startAngle="345" data:strokeWidth="2" data:value="1" data:pathOrig="M 79.79057925852034 11.827844565940111 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 86.00960111055693 35.03755009112176 L 79.79057925852034 11.827844565940111 z" stroke="#ffffff"></path></g><g id="SvgjsG9461" class="apexcharts-series apexcharts-pie-series" seriesName="ExternalxLinksxxNofollow" rel="3" data:realIndex="2"><path id="SvgjsPath9462" d="M 104.66666666666666 8.55284552845528 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 104.66666666666666 32.58130081300813 L 104.66666666666666 8.55284552845528 z" fill="rgba(248,40,90,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-2" index="0" j="2" data:angle="0" data:startAngle="360" data:strokeWidth="2" data:value="0" data:pathOrig="M 104.66666666666666 8.55284552845528 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 104.66666666666666 32.58130081300813 L 104.66666666666666 8.55284552845528 z" stroke="#ffffff"></path></g></g></g></g><line id="SvgjsLine9463" x1="0" y1="0" x2="209.33333333333334" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9464" x1="0" y1="0" x2="209.33333333333334" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg><div class="apexcharts-tooltip apexcharts-theme-dark"><div class="apexcharts-tooltip-series-group" style="order: 1;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(27, 132, 255);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 2;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(23, 198, 83);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 3;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(248, 40, 90);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div></div></div></div>
                        </div>
                        <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-300px min-w-xl-250px"><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-primary me-3"></div>
<div class="text-gray-500">Internal Links</div>
<div class="ms-auto fw-bold text-gray-500">23</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-success me-3"></div>
<div class="text-gray-500">External Links: Follow</div>
<div class="ms-auto fw-bold text-gray-500">1</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-danger me-3"></div>
<div class="text-gray-500">External Links: Nofollow</div>
<div class="ms-auto fw-bold text-gray-500">0</div>
</div></div>
                    </div>
                </div>
            </div>
        </div><div class="field-details"><div class="js-collapse-parent">
   <a class="btn btn-light btn-sm js-collapse-in">Show Details</a>
   <div class="js-collapse-target collapse">
       <div class="answer headers field-value-table"><div class="table-responsive table-part"><table class="table table-row-dashed table-fluid"><thead><tr><th width="60%">Page</th><th width="20%">Type</th><th width="20%">Follow/ Nofollow</th></tr></thead><tbody><tr class=""><td width="60%">https://kommentify.com</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/about</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/contact</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/features</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/lifetime-deal</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/login</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/privacy-policy</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/referral</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/refund-policy</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/signup</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://kommentify.com/terms</td><td width="20%"><span class="badge badge-light-primary">Internal</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr><tr class=""><td width="60%">https://chromewebstore.google.com/detail/kommentify-linkedin-auto/laeckkpjacbodjglcnenggpdpehkacei</td><td width="20%"><span class="badge badge-light">External</span></td><td width="20%"><span class="badge badge-light-success">Follow</span></td></tr></tbody></table></div></div>
       <a class="btn btn-light btn-sm js-collapse-out mt-3">Hide Details</a>
   </div>
</div></div>
        <div class="check-info" style="display: none"><p class="what">On-Page Link Structuring is a complex SEO topic with a variety of opinions covering how frequently you should link to external vs internal pages, and in which cases to use nofollow links. We provide an informational breakdown on on the page's links for your review.</p><p class="how">Some general principles in regards to link structuring include having a strong proportion of your links being to internal pages, as well as explicitly using 'Nofollow' links for any external links that may be to lower quality sites where you don't intend to pass value.</p></div></div>
    </div>    <div class="row-hidden check-group">
        <div class="faq-box row-hidden field-hasBrokenLinks">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Broken Links</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        </div><div class="faq-box row-hidden field-hasBrokenLinks" id="hasBrokenLinks62508487">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Broken Links</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasFriendlyUrl">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Friendly Links</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        </div><div class="faq-box row-hidden field-hasFriendlyUrl expandable" id="hasFriendlyUrl62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Friendly Links</h5>
                        <div class="answer field-value">Your link URLs appear friendly (easily human or search engine readable).</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="field-details"></div>
        <div class="check-info" style="display: none"><p class="what">In general, website URLs should be simple and human readable or 'friendly'. This aids in human recognition of the page in the address bar, makes manually typing a page easier, as well as providing more context around the page to Search Engines.</p><p class="how">You should aim to use short human readable URLs, with words separated by hyphens, and remove file names, special characters, code strings and multiple levels of sub-folders. Most modern CMS systems will provide options to create friendly URLs. In some systems where a website is older or a collection of files this may be more challenging to reconfigure, but can still be achieved.</p><p class="more-info"><a href="/blog/properly-optimized-url/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group">
        <div class="faq-box row-hidden field-targetUrl tr-always-border">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Target Keyword in URL</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            
        </div><div class="faq-box row-hidden field-targetUrl tr-always-border" id="targetUrl62508487">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Target Keyword in URL</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            
        <div class="check-info" style="display: none"></div></div>
    </div>            </div>
        </div>
    </div>
</div>

                        <div class="row g-5 gx-xl-10 mb-5 mb-xl-10 active">
    <div class="col-xxl-12">
        <div class="guest-banner card card-flush bg-primary text-white overflow-hidden p-10 m-0 portlet">
            <div class="guest-banner-container d-flex align-items-center align-items-lg-stretch justify-content-center flex-column flex-lg-row min-h-180px">
                <div class="guest-banner-image-container d-flex pe-lg-6 justify-content-center align-items-start position-relative w-75 w-md-50">
                    <img class="position-lg-absolute mx-auto" style="width: 80%; top: 13%;" src="/img/banner_default.png">
                </div>
                <div class="guest-banner-text-container ps-lg-4 w-100 position-relative w-lg-50 mt-6 mt-lg-0">
                    <h2 class="fw-semibold text-white mb-7">Create White Label PDFs</h2>
                    <p class="fs-5">Upload your own logo and company's contact details. Generate unlimited PDFs under our White Label plans. See an <a class="text-white text-decoration-underline" href="/docs/seo-audit-sample-pdf_en.pdf">example PDF Report</a></p><p class="fs-5">Embed the Audit Tool into your website. Get notified of leads straight from your website.</p>                                            <div class="btn btn-sm btn-success result_banner-btn">
                            <a class="text-white" target="_blank" href="/white-label/">Learn More - White Label</a>
                        </div>
                                        <div class="guest-banner-logo min-w-210 position-absolute end-0 bottom-0 me-n2 mb-n6 d-none d-lg-block">
                        <img src="/img/logo_site_white.png">
                    </div>
                </div>
                            </div>
        </div>
    </div>
</div>

                        <div class="container-check block tab-uimobile" style="">
    <div class="row g-5 gx-xl-10 mb-5 mb-xl-10" id="uimobile">
        <div class="col-xxl-12 position-relative">
            <div class="portlet card card-flush">
                <div class="avoid-break-inside">
                    <div class="portlet-heading card-header pt-7 border-bottom-0 without-js-header-container avoid-break-inside">
                        <h2 class="section-title align-items-start flex-column">
                            <span class="fw-bold">
                                Usability                            </span>
                        </h2>
                    </div>
                    <div class="portlet-body card-body pt-0 pt-md-6 pb-4 pb-md-8">
                        <div class="row">
                            <div class="col-md-3 col-12 col-pdf-3">
                                <div class="text-center w-100">
                                    <style>
    :root{
        --section-score-chart-size: 190px;
    }
</style>
<div class="score-graph-wrapper mt-n4 mb-6 mb-md-0 w-100">
    <div class="knob ui-score check-score" style="width: 100%; visibility: visible; -webkit-text-fill-color: var(--bs-primary); min-height: 191px;" data-value="43" data-width="190" data-height="190" data-fgcolor="primary" data-label="C"><div id="apexchartsndleqyr3f" class="apexcharts-canvas apexchartsndleqyr3f apexcharts-theme-light" style="width: 184px; height: 191px;"><svg id="SvgjsSvg9594" width="184" height="191" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="184" height="191"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9596" class="apexcharts-inner apexcharts-graphical" transform="translate(-3, 1)"><defs id="SvgjsDefs9595"><clipPath id="gridRectMaskndleqyr3f"><rect id="SvgjsRect9597" width="196" height="200" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskndleqyr3f"></clipPath><clipPath id="nonForecastMaskndleqyr3f"></clipPath><clipPath id="gridRectMarkerMaskndleqyr3f"><rect id="SvgjsRect9598" width="194" height="192" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9599" class="apexcharts-radialbar"><g id="SvgjsG9600"><g id="SvgjsG9601" class="apexcharts-tracks"><g id="SvgjsG9602" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 94.9877592823448 23.865854726740707" fill="none" fill-opacity="1" stroke="rgba(233,243,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.04878048780488" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 94.9877592823448 23.865854726740707"></path></g></g><g id="SvgjsG9604"><g id="SvgjsG9608" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9609" d="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 0 1 124.63997101549711 157.56312296643625" fill="none" fill-opacity="0.85" stroke="rgba(27,132,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.04878048780488" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="155" data:value="43" index="0" j="0" data:pathOrig="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 0 1 124.63997101549711 157.56312296643625"></path></g><circle id="SvgjsCircle9605" r="64.60975609756098" cx="95" cy="94" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9606" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9607" font-family="inherit" x="95" y="106" text-anchor="middle" dominant-baseline="auto" font-size="30px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">C</text></g></g></g></g><line id="SvgjsLine9610" x1="0" y1="0" x2="190" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9611" x1="0" y1="0" x2="190" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
    </div>

                                </div>
                            </div>
                            <div class="col-md-9 col-12 col-pdf-9">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <h3 class="font-600 ui-score-message ms-0 ms-xl-n4">Your usability could be better</h3>
                                        <div class="ui-score-description ms-0 ms-xl-n4">Your page is OK but could be more usable across devices. Usability is important to maximize your available audience and minimize user bounce rates (which can indirectly affect your search engine rankings).</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="portlet-body card-body pt-0">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-deviceRendering avoid-break-inside">
            <div class="row rendering-images-container"> 
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Device Rendering</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="rendering-images avoid-break-inside"></div></div>            
        </div><div class="faq-box row-hidden field-deviceRendering avoid-break-inside expandable" id="deviceRendering62508487" style="display: block;">
            <div class="row rendering-images-container"> 
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Device Rendering</h5>
                    <div class="answer field-value">This check visually demonstrates how your page renders on different devices. It is important that your page is optimized for mobile and tablet experiences as today the majority of web traffic comes from these sources.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="rendering-images avoid-break-inside"><div class="d-flex col-12 mb-4 flex-wrap flex-md-nowrap justify-content-center justify-content-md-start"><div class="col-screenshot-mobile d-flex">
                    <div class="screenshot mobile" style="-webkit-user-select: none;">
                        <div class="screenshot-img-container" style="background-image:url(/screenshots/7gVel7FOgLPrQgQQAhb5Vk2tMTXdpaZm-mobile.jpg)!important;">
                        </div>
                    </div>
                </div>
                <div class="col-screenshot-tablet d-flex">
                    <div class="screenshot tablet" style="-webkit-user-select: none;">
                        <div class="screenshot-img-container" style="background-image:url(/screenshots/7gVel7FOgLPrQgQQAhb5Vk2tMTXdpaZm-tablet.jpg)!important;">

                        </div>
                    </div>
                </div>
            </div>
</div></div>            
        <div class="check-info" style="display: none"><p class="what">A website can be viewed in a wide variety of resolutions and formats, some dictated by the size of a desktop display, and others by the specific dimensions of a phone or tablet model. Device rendering provides a preview of how the site looks on some popular device resolutions to help identify obvious issues. Note, our method will load a website and resize it's portlet to several dimensions, as opposed to loading the site multiple times directly in different devices.</p><p class="how">In general a website should be designed and tested to be responsive across a large variety of desktop and mobile device resolutions, as well as being able to transition smoothly (for example when resizing a browser or flipping a tablet from vertical to horizontal).</p></div></div>
    </div>
                                
<!-- Elements for calculating width of charts -->
<div class="row">
    <div id="coreWebVitals-chart-sizer" class="col-12 col-md-6 col-xl-4 pdf-third"></div>
</div>

<div style="padding: 0 36px;">
    <div class="row competitor-charts-container">
        <div id="coreWebVitals-competitor-chart-sizer" class="col-12 col-md-6 col-xl-4 pdf-third"></div>
    </div>
</div>

    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-coreWebVitals">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Google's Core Web Vitals</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="row charts-container avoid-break-inside" style="display: none;">
    <div class="col-12 col-md-6 col-xl-4 js-web-vitals-details">
        <div class="avoid-break-inside chart-container text-center d-flex flex-wrap flex-center">
            <div class="fs-2 fs-pdf-4 my-5 text-center avoid-break-after w-100">Largest Contentful <br class="hidden-web">Paint <br class="visible-sm hidden-pdf">(LCP)</div>
            <div class="position-relative canvas-label">
                <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                    <span class="fw-bolder text-gray-700"></span>
                </div>
                <canvas class="chart-graph" id="graph-largest-contentful-paint" width="100" height="184"></canvas>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-6 col-xl-4 interaction-to-next-paint js-web-vitals-details">
        <div class="avoid-break-inside chart-container text-center d-flex flex-wrap flex-center">
            <div class="fs-2 fs-pdf-4 my-5 text-center avoid-break-after w-100">Interaction To Next <br class="hidden-web">Paint <br class="visible-sm hidden-pdf">(INP)</div>
            <div class="position-relative canvas-label">
                <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                    <span class="fw-bolder text-gray-700"></span>
                </div>
                <canvas class="chart-graph" id="graph-interaction-to-next-paint" width="100" height="184"></canvas>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-6 col-xl-4 js-web-vitals-details">
        <div class="avoid-break-inside chart-container text-center d-flex flex-wrap flex-center">
            <div class="fs-2 fs-pdf-4 my-5 text-center avoid-break-after w-100">Cumulative Layout <br class="hidden-web">Shift <br class="visible-sm hidden-pdf">(CLS)</div>
            <div class="position-relative canvas-label">
                <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                    <span class="fw-bolder text-gray-700"></span>
                </div>
                <canvas class="chart-graph" id="graph-cumulative-layout-shift" width="100" height="184"></canvas>
            </div>
        </div>
    </div>
</div>
            
        </div><div class="faq-box row-hidden field-coreWebVitals expandable" id="coreWebVitals62508487" style="display: block;">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Google's Core Web Vitals</h5>
                    <div class="answer field-value">Google is indicating that they do not have 'sufficient real-world speed data for this page' in order to make a Core Web Vitals assessment. This can occur for smaller websites or those that are not crawl-able by Google.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="row charts-container avoid-break-inside" style="display: none;">
    <div class="col-12 col-md-6 col-xl-4 js-web-vitals-details">
        <div class="avoid-break-inside chart-container text-center d-flex flex-wrap flex-center">
            <div class="fs-2 fs-pdf-4 my-5 text-center avoid-break-after w-100">Largest Contentful <br class="hidden-web">Paint <br class="visible-sm hidden-pdf">(LCP)</div>
            <div class="position-relative canvas-label">
                <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                    <span class="fw-bolder text-gray-700"></span>
                </div>
                <canvas class="chart-graph" id="graph-largest-contentful-paint" width="100" height="184"></canvas>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-6 col-xl-4 interaction-to-next-paint js-web-vitals-details">
        <div class="avoid-break-inside chart-container text-center d-flex flex-wrap flex-center">
            <div class="fs-2 fs-pdf-4 my-5 text-center avoid-break-after w-100">Interaction To Next <br class="hidden-web">Paint <br class="visible-sm hidden-pdf">(INP)</div>
            <div class="position-relative canvas-label">
                <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                    <span class="fw-bolder text-gray-700"></span>
                </div>
                <canvas class="chart-graph" id="graph-interaction-to-next-paint" width="100" height="184"></canvas>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-6 col-xl-4 js-web-vitals-details">
        <div class="avoid-break-inside chart-container text-center d-flex flex-wrap flex-center">
            <div class="fs-2 fs-pdf-4 my-5 text-center avoid-break-after w-100">Cumulative Layout <br class="hidden-web">Shift <br class="visible-sm hidden-pdf">(CLS)</div>
            <div class="position-relative canvas-label">
                <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                    <span class="fw-bolder text-gray-700"></span>
                </div>
                <canvas class="chart-graph" id="graph-cumulative-layout-shift" width="100" height="184"></canvas>
            </div>
        </div>
    </div>
</div>
            
        <div class="check-info" style="display: none"><p class="what">Core Web Vitals are UI Metrics designed by Google that measure the overall quality of user experience on your site. They assess things such as the appearance of content, interactivity of the page and visual stability from the moment of page load. Core Web Vitals are gathered from real world usage data of a website (hence some smaller websites that haven't been well sampled may not return an appropriate result). Google has made Core Web Vitals a ranking factor for pages with increasing importance.</p><p class="how">To improve your Core Web Vitals scores, you may need to read Google's documentation on the topic and follow the recommendations provided in the Google's PageSpeed Insights assessment.</p><p class="more-info"><a href="/blog/core-web-vitals/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>
                                    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasMobileViewports avoid-break-inside">
             
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Use of Mobile Viewports</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-hasMobileViewports avoid-break-inside expandable" id="hasMobileViewports62508487" style="display: block;">
             
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Use of Mobile Viewports</h5>
                    <div class="answer field-value">Your page specifies a Viewport matching the device's size, allowing it to render appropriately across devices.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">The Viewport is a Meta Tag within the page's HTML which gives the browser instructions for how to control the page's dimensions and scaling. Setting the Viewport is particularly important for mobile and tablet device responsiveness, as without it, the page can appear incorrectly sized and require zooming or scrolling to view content.</p><p class="how">Make sure you include one Meta Viewport tag in the Head section of page HTML.</p><p class="more-info"><a href="/blog/viewport/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-mobilePageInsights">
            <div class="avoid-break-inside"> 
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Google's PageSpeed Insights - Mobile</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="text-center graph-container mt-3"></div>
                             </div>
                             <div class="field-details avoid-break-inside row row-gap-8" id="insights-tables-mobile"></div>            
        </div><div class="faq-box row-hidden field-mobilePageInsights expandable" id="mobilePageInsights62508487" style="display: block;">
            <div class="avoid-break-inside"> 
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Google's PageSpeed Insights - Mobile</h5>
                    <div class="answer field-value">Google is indicating that your page is scoring poorly on their Mobile PageSpeed Insights evaluation.<br><br>Note that this evaluation is being performed from US servers and the results may differ slightly from an evaluation carried out from Google's PageSpeed Web Interface as that reporting localizes to the region in which you are running the report.<div class="append2">Google has indicated that the performance of a webpage is becoming more important from a user and subsequently ranking perspective.</div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="text-center graph-container mt-3" align="center"><div class="text-center mobile-insight-score-62508487" data-width="150px" data-height="150px" data-fgcolor="danger" data-label="23" data-value="23" data-color="danger" style="visibility: visible; min-height: 151px;"><div id="apexchartscd4myfkl" class="apexcharts-canvas apexchartscd4myfkl apexcharts-theme-light" style="width: 760px; height: 151px;"><svg id="SvgjsSvg9742" width="760" height="151" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="760" height="151"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9744" class="apexcharts-inner apexcharts-graphical" transform="translate(305, 1)"><defs id="SvgjsDefs9743"><clipPath id="gridRectMaskcd4myfkl"><rect id="SvgjsRect9745" width="156" height="160" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskcd4myfkl"></clipPath><clipPath id="nonForecastMaskcd4myfkl"></clipPath><clipPath id="gridRectMarkerMaskcd4myfkl"><rect id="SvgjsRect9746" width="154" height="152" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9747" class="apexcharts-radialbar"><g id="SvgjsG9748"><g id="SvgjsG9749" class="apexcharts-tracks"><g id="SvgjsG9750" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 75 20.963414634146332 A 53.03658536585367 53.03658536585367 0 1 1 74.99074336966049 20.963415441939716" fill="none" fill-opacity="1" stroke="rgba(255,238,243,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="9.439024390243903" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 75 20.963414634146332 A 53.03658536585367 53.03658536585367 0 1 1 74.99074336966049 20.963415441939716"></path></g></g><g id="SvgjsG9752"><g id="SvgjsG9756" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9757" d="M 75 20.963414634146332 A 53.03658536585367 53.03658536585367 0 0 1 127.64125870107452 67.53646616501236" fill="none" fill-opacity="0.85" stroke="rgba(248,40,90,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="9.439024390243903" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="83" data:value="23" index="0" j="0" data:pathOrig="M 75 20.963414634146332 A 53.03658536585367 53.03658536585367 0 0 1 127.64125870107452 67.53646616501236"></path></g><circle id="SvgjsCircle9753" r="48.31707317073172" cx="75" cy="74" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9754" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9755" font-family="inherit" x="75" y="86" text-anchor="middle" dominant-baseline="auto" font-size="30px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">23</text></g></g></g></g><line id="SvgjsLine9758" x1="0" y1="0" x2="150" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9759" x1="0" y1="0" x2="150" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div></div>
                             </div>
                             <div class="field-details avoid-break-inside row row-gap-8" id="insights-tables-mobile"><div class="col-md-6 col-sm-12"><table class="table table-row-dashed table-fluid"><thead><tr><th>Lab Data</th><th>Value</th></tr></thead><tbody><tr><td>First Contentful Paint</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">20.8 s</td></tr><tr><td>Speed Index</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">20.8 s</td></tr><tr><td>Largest Contentful Paint</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">21.9 s</td></tr><tr><td>Time to Interactive</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">22.9 s</td></tr><tr><td>Total Blocking Time</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">1.03 s</td></tr><tr><td>Cumulative Layout Shift</td><td style="color:var(--bs-success);-webkit-text-fill-color:var(--bs-success)">0</td></tr></tbody></table></div><div class="col-md-6 col-sm-12"><table class="table table-row-dashed table-fluid"><thead><tr><th>Opportunities</th><th class="w-pdf-80px mw-pdf-80px">Estimated Savings</th></tr></thead><tbody><tr><td>Avoid multiple page redirects</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">0.63 s</td></tr><tr><td>Reduce unused JavaScript</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">0.31 s</td></tr><tr><td>Reduce unused CSS</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">0.3 s</td></tr></tbody></table></div></div>            
        <div class="check-info" style="display: none"><p class="what">PageSpeed Insights is a tool from Google that evaluates a website's performance in both mobile and desktop, providing suggestions for how to improve it. Google has indicated that performance is becoming a more important ranking factor, so understanding Google's own analysis of your site is valuable. Also irrespective of SEO rankings, it has been well researched that pages that load faster perform better in user bounce rate and conversions.</p><p class="how">We recommend reviewing and implementing some of Google's listed opportunities to improve your site.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-desktopPageInsights">
            <div class="avoid-break-inside"> 
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Google's PageSpeed Insights - Desktop</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="text-center graph-container mt-3"></div>
                             </div>
                             <div class="field-details avoid-break-inside row row-gap-8" id="insights-tables-desktop"></div>            
        </div><div class="faq-box row-hidden field-desktopPageInsights expandable" id="desktopPageInsights62508487" style="display: block;">
            <div class="avoid-break-inside"> 
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Google's PageSpeed Insights - Desktop</h5>
                    <div class="answer field-value">Google is indicating that your page is scoring poorly on their Desktop PageSpeed Insights evaluation.<div class="append2">Google has indicated that the performance of a webpage is becoming more important from a user and subsequently ranking perspective.</div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="text-center graph-container mt-3" align="center"><div class="text-center desktop-insight-score-62508487" data-width="150px" data-height="150px" data-fgcolor="danger" data-label="49" data-value="49" data-color="danger" style="visibility: visible; min-height: 151px;"><div id="apexchartswwf1y2o8" class="apexcharts-canvas apexchartswwf1y2o8 apexcharts-theme-light" style="width: 760px; height: 151px;"><svg id="SvgjsSvg9760" width="760" height="151" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="760" height="151"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9762" class="apexcharts-inner apexcharts-graphical" transform="translate(305, 1)"><defs id="SvgjsDefs9761"><clipPath id="gridRectMaskwwf1y2o8"><rect id="SvgjsRect9763" width="156" height="160" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskwwf1y2o8"></clipPath><clipPath id="nonForecastMaskwwf1y2o8"></clipPath><clipPath id="gridRectMarkerMaskwwf1y2o8"><rect id="SvgjsRect9764" width="154" height="152" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9765" class="apexcharts-radialbar"><g id="SvgjsG9766"><g id="SvgjsG9767" class="apexcharts-tracks"><g id="SvgjsG9768" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 75 20.963414634146332 A 53.03658536585367 53.03658536585367 0 1 1 74.99074336966049 20.963415441939716" fill="none" fill-opacity="1" stroke="rgba(255,238,243,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="9.439024390243903" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 75 20.963414634146332 A 53.03658536585367 53.03658536585367 0 1 1 74.99074336966049 20.963415441939716"></path></g></g><g id="SvgjsG9770"><g id="SvgjsG9774" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9775" d="M 75 20.963414634146332 A 53.03658536585367 53.03658536585367 0 0 1 78.69964517455124 126.9073909095119" fill="none" fill-opacity="0.85" stroke="rgba(248,40,90,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="9.439024390243903" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="176" data:value="49" index="0" j="0" data:pathOrig="M 75 20.963414634146332 A 53.03658536585367 53.03658536585367 0 0 1 78.69964517455124 126.9073909095119"></path></g><circle id="SvgjsCircle9771" r="48.31707317073172" cx="75" cy="74" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9772" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9773" font-family="inherit" x="75" y="86" text-anchor="middle" dominant-baseline="auto" font-size="30px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">49</text></g></g></g></g><line id="SvgjsLine9776" x1="0" y1="0" x2="150" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9777" x1="0" y1="0" x2="150" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div></div>
                             </div>
                             <div class="field-details avoid-break-inside row row-gap-8" id="insights-tables-desktop"><div class="col-md-6 col-sm-12"><table class="table table-row-dashed table-fluid"><thead><tr><th>Lab Data</th><th>Value</th></tr></thead><tbody><tr><td>First Contentful Paint</td><td style="color:var(--bs-success);-webkit-text-fill-color:var(--bs-success)">0.9 s</td></tr><tr><td>Speed Index</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">5.2 s</td></tr><tr><td>Largest Contentful Paint</td><td style="color:var(--bs-success);-webkit-text-fill-color:var(--bs-success)">1 s</td></tr><tr><td>Time to Interactive</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">10 s</td></tr><tr><td>Total Blocking Time</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">4.39 s</td></tr><tr><td>Cumulative Layout Shift</td><td style="color:var(--bs-success);-webkit-text-fill-color:var(--bs-success)">0</td></tr></tbody></table></div><div class="col-md-6 col-sm-12"><table class="table table-row-dashed table-fluid"><thead><tr><th>Opportunities</th><th class="w-pdf-80px mw-pdf-80px">Estimated Savings</th></tr></thead><tbody><tr><td>Avoid multiple page redirects</td><td style="color:var(--bs-danger);-webkit-text-fill-color:var(--bs-danger)">0.19 s</td></tr></tbody></table></div></div>            
        <div class="check-info" style="display: none"><p class="what">PageSpeed Insights is a tool from Google that evaluates a website's performance in both mobile and desktop, providing suggestions for how to improve it. Google has indicated that performance is becoming a larger ranking factor, so understanding Google's own analysis of your site is valuable. Also irrespective of SEO rankings, it has been well researched that pages that load faster perform better in user bounce rate and conversions.</p><p class="how">We recommend reviewing and implementing some of Google's listed opportunities to improve your site.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasFlash avoid-break-inside">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Flash Used?</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-hasFlash avoid-break-inside expandable" id="hasFlash62508487" style="display: block;">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Flash Used?</h5>
                    <div class="answer field-value">No Flash content has been identified on your page.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        <div class="check-info" style="display: none"><p class="what">Flash is an old embedded website technology that was frequently used in heavily animated features such as games and videos. However, Flash is not supported by all mobile devices and is not easily read by search engines. Improvements to HTML and CSS and the increased speed of modern web browsers have made it possible to implement many similar features with standard web technologies.</p><p class="how">If Flash is detected on your site, you should carefully consider whether it is necessary due to the several drawbacks.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasIframe avoid-break-inside">
             
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">iFrames Used?</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-hasIframe avoid-break-inside expandable" id="hasIframe62508487" style="display: block;">
             
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">iFrames Used?</h5>
                    <div class="answer field-value">Your page appears to be using iFrames.<div class="append2">iFrames are discouraged as they can complicate navigation of content in mobile and have historically been harder to index for search engines.</div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">iFrames are a HTML tag that allow you to embed other webpages inside your page in a small frame. They generally represent an older coding practice and are discouraged as they can complicate navigation, particularly in mobile, and are harder for search engines to index.</p><p class="how">We recommend removing any iFrames if they don't serve a critical purpose, or could be replaced with more natural navigation. However, some coding libraries like Google Tag Manager may still rely on iFrames as part of their internal functionality to load external pages and code files, so you may need to evaluate your usage of them on a case by case basis.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasFavicon avoid-break-inside">
             
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Favicon</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        </div><div class="faq-box row-hidden field-hasFavicon avoid-break-inside expandable" id="hasFavicon62508487" style="display: block;">
             
            <div class="row">
                <div class="col-11 ">
                    <h5 class="question" data-wow-delay=".1s">Favicon</h5>
                    <div class="answer field-value">Your page has specified a Favicon.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
                        
        <div class="check-info" style="display: none"><p class="what">A Favicon is a small icon that serves as branding for your website. It's main purpose is to help visitors locate your page easier when they have multiple tabs open. It adds legitimacy to your site and helps boost your online branding as well as trust from potential consumers.</p><p class="how">Either use an online Favicon builder tool, or a graphic designer to build your Favicon, and load them into your website or CMS.</p><p class="more-info"><a href="/blog/what-is-a-favicon/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasEmail avoid-break-inside">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Email Privacy</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-hasEmail avoid-break-inside expandable" id="hasEmail62508487" style="display: block;">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Email Privacy</h5>
                    <div class="answer field-value">No email addresses have been found in plain text on your page.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        <div class="check-info" style="display: none"><p class="what">Email addresses shown in clear text on your website can be easily scraped by bots, leading to inclusion in spam mailing lists.</p><p class="how">We recommend removing any plain text email addresses and replacing them with contact forms, images, or less obvious text like 'email at website'.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasLegibleFontsizes">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Legible Font Sizes</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-hasLegibleFontsizes expandable" id="hasLegibleFontsizes62508487" style="display: block;">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Legible Font Sizes</h5>
                    <div class="answer field-value">The text on your page appears to be legible across devices.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        <div class="check-info" style="display: none"><p class="what">Page text legibility is important from an accessibility perspective, and also to ensure your users can comfortably spend time on your site. In particular it's important  to review text legibility on mobile and tablet devices where the text may naturally be smaller or lower lighting could make it more challenging to read.</p><p class="how">We recommend reviewing the legibility of your text including less considered items like footer links and text.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasTapTargetSizing">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Tap Target Sizing</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        </div><div class="faq-box row-hidden field-hasTapTargetSizing expandable" id="hasTapTargetSizing62508487" style="display: block;">
             
            <div class="row">
                <div class="col-11  avoid-break-inside">
                    <h5 class="question" data-wow-delay=".1s">Tap Target Sizing</h5>
                    <div class="answer field-value">The links and buttons on your page appear to be appropriately sized for a user to easily tap on a touchscreen.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>  
            <div class="field-details"></div>            
        <div class="check-info" style="display: none"><p class="what">Tap Target Sizing refers to the size of buttons, links and other navigational elements on the page. On touch screen devices in particular these elements can't be too small or too close together or they will impede clicking and frustrate users.</p><p class="how">We recommend reviewing the Tap Target Sizing of your  of all your text to ensure they're easily clickable including less considered items like footer elements.</p></div></div>
    </div>                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                        <div class="container-check block tab-performance" style="">
    <div class="row g-5 gx-xl-10 mb-5 mb-xl-10" id="performance">
        <div class="col-xxl-12 position-relative">
            <div class="portlet card card-flush">
                <div class="portlet-heading card-header pt-7 avoid-break-inside  border-bottom-0">
                    <h2 class="section-title align-items-start flex-column">
                        <span class="fw-bold">
                            Performance Results                        </span>
                    </h2>
                </div>
                <div class="portlet-body card-body pt-0 pt-md-6 pb-4 pb-md-8">
                    <div class="row">
                        <div class="col-md-3 col-12 col-pdf-3">
                            <div class="text-center w-100">
                                <style>
    :root{
        --section-score-chart-size: 190px;
    }
</style>
<div class="score-graph-wrapper mt-n4 mb-6 mb-md-0 w-100">
    <div class="knob performance-score check-score" style="width: 100%; visibility: visible; -webkit-text-fill-color: var(--bs-primary); min-height: 191px;" data-value="75" data-width="190" data-height="190" data-fgcolor="primary" data-label="A-"><div id="apexchartsbkmebn77" class="apexcharts-canvas apexchartsbkmebn77 apexcharts-theme-light" style="width: 184px; height: 191px;"><svg id="SvgjsSvg9612" width="184" height="191" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="184" height="191"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9614" class="apexcharts-inner apexcharts-graphical" transform="translate(-3, 1)"><defs id="SvgjsDefs9613"><clipPath id="gridRectMaskbkmebn77"><rect id="SvgjsRect9615" width="196" height="200" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMaskbkmebn77"></clipPath><clipPath id="nonForecastMaskbkmebn77"></clipPath><clipPath id="gridRectMarkerMaskbkmebn77"><rect id="SvgjsRect9616" width="194" height="192" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9617" class="apexcharts-radialbar"><g id="SvgjsG9618"><g id="SvgjsG9619" class="apexcharts-tracks"><g id="SvgjsG9620" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 94.9877592823448 23.865854726740707" fill="none" fill-opacity="1" stroke="rgba(233,243,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.04878048780488" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 94.9877592823448 23.865854726740707"></path></g></g><g id="SvgjsG9622"><g id="SvgjsG9626" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9627" d="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 24.86585365853658 94.00000000000001" fill="none" fill-opacity="0.85" stroke="rgba(27,132,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.04878048780488" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="270" data:value="75" index="0" j="0" data:pathOrig="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 24.86585365853658 94.00000000000001"></path></g><circle id="SvgjsCircle9623" r="64.60975609756098" cx="95" cy="94" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9624" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9625" font-family="inherit" x="95" y="106" text-anchor="middle" dominant-baseline="auto" font-size="30px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">A-</text></g></g></g></g><line id="SvgjsLine9628" x1="0" y1="0" x2="190" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9629" x1="0" y1="0" x2="190" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
    </div>

                            </div>
                        </div>
                        <div class="col-md-9 col-12 col-pdf-9">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h3 class="font-600 performance-score-message ms-0 ms-xl-n4">Your performance is good</h3>
                                    <div class="performance-score-description ms-0 ms-xl-n4">Your page has performed well in our testing meaning it should be reasonably responsive for your users, but there is still room for improvement. Performance is important to ensure a good user experience, and reduced bounce rates (which can also indirectly affect your search engine rankings).</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="portlet-body card-body pt-0">
                    <div class="row">
                        <div class="col-md-12">
                            <!-- Elements for calculating width of charts -->
                            <div class="row">
                                <div class="col-12 col-md-6 col-xl-4 pdf-third" id="speedchart"></div>
                            </div>
                            <div style="padding: 0 36px">
                                <div class="row" id="speedchart-competitor">
                                    <div class="col-12 col-md-6 col-xl-4 pdf-third"></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 col-md-6 pdf-half" id="sizechart"></div>
                            </div>
                            <div style="padding: 0 36px">
                                <div class="row" id="sizechart-competitor">
                                    <div class="col-12 col-md-6 pdf-half"></div>
                                </div>
                            </div>

                                <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden page-speed field-serverResponseTime">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Website Load Speed</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="charts"></div> 
        </div><div class="faq-box row-hidden page-speed field-serverResponseTime expandable" id="serverResponseTime62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Website Load Speed</h5>
                    <div class="answer field-value">Your page loads in a reasonable amount of time.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="charts"><div class="row ">
                                            <div class="col-12 col-md-6 col-xl-4">
                                                <div class="avoid-break-inside text-center d-flex flex-wrap flex-center">
                                                    <div class="fs-2 fs-pdf-4 my-5 text-center w-100">Server Response</div>
                                                    <div class="position-relative canvas-label" style="min-width: 330px;">
                                                        <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                                             <span class="fw-bolder text-gray-700" style="font-size: 22px; padding-top: 52px;">0.1s</span>
                                                        </div>                                                        <canvas class="speed-first-byte mt-n8" width="330" height="205" id="serverResponseTime62508487speed-first-byte" style="width: 330px; cursor: default;"></canvas>
                                                    </div>                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 col-xl-4">
                                                <div class="avoid-break-inside text-center d-flex flex-wrap flex-center">
                                                    <div class="fs-2 fs-pdf-4 my-5 text-center w-100">All Page Content Loaded</div>
                                                    <div class="position-relative canvas-label" style="min-width: 330px;">
                                                        <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                                             <span class="fw-bolder text-gray-700" style="font-size: 22px; padding-top: 52px;">8.3s</span>
                                                        </div>                                                        <canvas class="speed-on-load mt-n8" width="330" height="205" id="serverResponseTime62508487speed-on-load" style="width: 330px; cursor: default;"></canvas>
                                                    </div>                                                </div>
                                            </div>
                                            <div class="col-12 col-md-6 col-xl-4">
                                                <div class="avoid-break-inside text-center d-flex flex-wrap flex-center">
                                                    <div class="fs-2 fs-pdf-4 my-5 text-center w-100">All Page Scripts Complete</div>
                                                    <div class="position-relative canvas-label" style="min-width: 330px;">
                                                        <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                                             <span class="fw-bolder text-gray-700" style="font-size: 22px; padding-top: 52px;">17.3s</span>
                                                        </div>                                                        <canvas class="speed-last-byte mt-n8" width="330" height="205" id="serverResponseTime62508487speed-last-byte" style="width: 330px; cursor: default;"></canvas>
                                                    </div>                                                </div>
                                            </div>
                                        </div></div> 
        <div class="check-info" style="display: none"><p class="what">Page Load Speed refers to the amount of time it takes to entirely load a webpage in a user's browser. Load speed is complex and  can be impacted by a multitude of factors including network, web server, page size, technology, database or coding problems, and may require the help of a developer or systems administrator to troubleshoot. Page Load Speed impacts a user's experience on a website and can directly impact bounce rate and conversions. Additionally, Search Engines are making Page Load Speed a ranking factor.</p><p class="how">Optimize Page Load Speed by examining common problem points such as overall file size, server resources or coding problems.</p><p class="more-info"><a href="/blog/page-speed/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-pageSize">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Website Download Size</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="charts"></div> 
        </div><div class="faq-box row-hidden field-pageSize expandable" id="pageSize62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Website Download Size</h5>
                    <div class="answer field-value">Your page's file size is reasonably low which is good for Page Load Speed and user experience.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="charts"><div class="row mb-4 avoid-break-inside ">
                                            <div class="col-12 col-xl-6">
                                                <div class="avoid-break-inside text-center d-flex flex-wrap flex-center">
                                                    <div class="fs-2 fs-pdf-4 my-5 text-center w-100">Download Page Size</div>
                                                    <div class="position-relative  canvas-label" style="min-width: 370px;">
                                                        <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                                             <span class="fw-bolder text-gray-700" style="font-size: 24.6667px; padding-top: 46px;">4.22MB</span>
                                                        </div>                                                    <canvas class="total-page-size mt-n15" width="370" height="230" id="pageSize62508487total-page-size" style="width: 370px; cursor: default;"></canvas>
                                                    </div>                                                </div>
                                            </div>
                                            <div class="col-12 col-xl-6 mt-5 mt-xl-0">
                                                <div class="avoid-break-inside text-center">
                                                    <div class="fs-2 fs-pdf-4 my-5 pb-6 pb-sm-3 text-center">Download Page Size Breakdown</div>
                                                    <div class="d-flex flex-wrap flex-sm-nowrap justify-content-center">
                                                        <div class="position-relative d-flex flex-center h-175px w-175px ms-11 mb-4 ms-sm-0 me-11 me-sm-15">
                                                            <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">
                                                                 <span class="fw-bolder text-gray-700" style="font-size: 25px;">4.22MB</span>
                                                                 <span class="fs-6 fs-pdf-7 fw-semibold text-gray-500 fs-pdf-8">Total</span>
                                                            </div>
                                                            <div class="page-size-breakdown pointer-event" width="280" height="206" id="pageSize62508487page-size-breakdown" style="min-height: 212.033px;"><div id="apexchartsu22g7yjv" class="apexcharts-canvas apexchartsu22g7yjv apexcharts-theme-light" style="width: 280px; height: 212.033px;"><svg id="SvgjsSvg9465" width="280" height="212.03333333333333" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="280" height="212.03333333333333"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9467" class="apexcharts-inner apexcharts-graphical" transform="translate(36.33333333333333, 0)"><defs id="SvgjsDefs9466"><clipPath id="gridRectMasku22g7yjv"><rect id="SvgjsRect9468" width="215.33333333333334" height="243.33333333333334" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMasku22g7yjv"></clipPath><clipPath id="nonForecastMasku22g7yjv"></clipPath><clipPath id="gridRectMarkerMasku22g7yjv"><rect id="SvgjsRect9469" width="213.33333333333334" height="235.33333333333334" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9470" class="apexcharts-pie"><g id="SvgjsG9471" transform="translate(0, 0) scale(1)"><circle id="SvgjsCircle9472" r="72.08536585365854" cx="104.66666666666667" cy="104.66666666666667" fill="transparent"></circle><g id="SvgjsG9473" class="apexcharts-slices"><g id="SvgjsG9474" class="apexcharts-series apexcharts-pie-series" seriesName="HTML" rel="1" data:realIndex="0"><path id="SvgjsPath9475" d="M 104.66666666666667 8.55284552845528 A 96.11382113821139 96.11382113821139 0 0 1 110.04385590564803 8.703379677963156 L 108.69955859590269 32.69420142513903 A 72.08536585365854 72.08536585365854 0 0 0 104.66666666666667 32.58130081300813 L 104.66666666666667 8.55284552845528 z" fill="rgba(248,40,90,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-0" index="0" j="0" data:angle="3.2071474279064964" data:startAngle="0" data:strokeWidth="2" data:value="39413" data:pathOrig="M 104.66666666666667 8.55284552845528 A 96.11382113821139 96.11382113821139 0 0 1 110.04385590564803 8.703379677963156 L 108.69955859590269 32.69420142513903 A 72.08536585365854 72.08536585365854 0 0 0 104.66666666666667 32.58130081300813 L 104.66666666666667 8.55284552845528 z" stroke="#ffffff"></path></g><g id="SvgjsG9476" class="apexcharts-series apexcharts-pie-series" seriesName="CSS" rel="2" data:realIndex="1"><path id="SvgjsPath9477" d="M 110.04385590564803 8.703379677963156 A 96.11382113821139 96.11382113821139 0 0 1 117.71282557501503 9.442382203478317 L 114.45128584792793 33.24845331927541 A 72.08536585365854 72.08536585365854 0 0 0 108.69955859590269 32.69420142513903 L 110.04385590564803 8.703379677963156 z" fill="rgba(13,202,240,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-1" index="0" j="1" data:angle="4.59406597664012" data:startAngle="3.2071474279064964" data:strokeWidth="2" data:value="56457" data:pathOrig="M 110.04385590564803 8.703379677963156 A 96.11382113821139 96.11382113821139 0 0 1 117.71282557501503 9.442382203478317 L 114.45128584792793 33.24845331927541 A 72.08536585365854 72.08536585365854 0 0 0 108.69955859590269 32.69420142513903 L 110.04385590564803 8.703379677963156 z" stroke="#ffffff"></path></g><g id="SvgjsG9478" class="apexcharts-series apexcharts-pie-series" seriesName="JS" rel="3" data:realIndex="2"><path id="SvgjsPath9479" d="M 117.71282557501503 9.442382203478317 A 96.11382113821139 96.11382113821139 0 1 1 28.011337439751728 162.6479318727776 L 47.175169746480464 148.15261557124987 A 72.08536585365854 72.08536585365854 0 1 0 114.45128584792793 33.24845331927541 L 117.71282557501503 9.442382203478317 z" fill="rgba(23,198,83,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-2" index="0" j="2" data:angle="225.09531810109263" data:startAngle="7.801213404546617" data:strokeWidth="2" data:value="2766222" data:pathOrig="M 117.71282557501503 9.442382203478317 A 96.11382113821139 96.11382113821139 0 1 1 28.011337439751728 162.6479318727776 L 47.175169746480464 148.15261557124987 A 72.08536585365854 72.08536585365854 0 1 0 114.45128584792793 33.24845331927541 L 117.71282557501503 9.442382203478317 z" stroke="#ffffff"></path></g><g id="SvgjsG9480" class="apexcharts-series apexcharts-pie-series" seriesName="Images" rel="4" data:realIndex="3"><path id="SvgjsPath9481" d="M 28.011337439751728 162.6479318727776 A 96.11382113821139 96.11382113821139 0 0 1 20.218309901720232 150.56156456924856 L 41.330399092956846 139.0878400936031 A 72.08536585365854 72.08536585365854 0 0 0 47.175169746480464 148.15261557124987 L 28.011337439751728 162.6479318727776 z" fill="rgba(27,132,255,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-3" index="0" j="3" data:angle="8.580846508009245" data:startAngle="232.89653150563925" data:strokeWidth="2" data:value="105451" data:pathOrig="M 28.011337439751728 162.6479318727776 A 96.11382113821139 96.11382113821139 0 0 1 20.218309901720232 150.56156456924856 L 41.330399092956846 139.0878400936031 A 72.08536585365854 72.08536585365854 0 0 0 47.175169746480464 148.15261557124987 L 28.011337439751728 162.6479318727776 z" stroke="#ffffff"></path></g><g id="SvgjsG9482" class="apexcharts-series apexcharts-pie-series" seriesName="Other" rel="5" data:realIndex="4"><path id="SvgjsPath9483" d="M 20.218309901720232 150.56156456924856 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 41.330399092956846 139.0878400936031 L 20.218309901720232 150.56156456924856 z" fill="rgba(196,202,218,1)" fill-opacity="1" stroke-opacity="1" stroke-linecap="butt" stroke-width="2" stroke-dasharray="0" class="apexcharts-pie-area apexcharts-donut-slice-4" index="0" j="4" data:angle="118.52262198635151" data:startAngle="241.4773780136485" data:strokeWidth="2" data:value="1456538" data:pathOrig="M 20.218309901720232 150.56156456924856 A 96.11382113821139 96.11382113821139 0 0 1 104.64989164039648 8.552846992352485 L 104.65408539696402 32.58130191093103 A 72.08536585365854 72.08536585365854 0 0 0 41.330399092956846 139.0878400936031 L 20.218309901720232 150.56156456924856 z" stroke="#ffffff"></path></g></g></g></g><line id="SvgjsLine9484" x1="0" y1="0" x2="209.33333333333334" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9485" x1="0" y1="0" x2="209.33333333333334" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg><div class="apexcharts-tooltip apexcharts-theme-dark"><div class="apexcharts-tooltip-series-group" style="order: 1;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(248, 40, 90);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 2;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(13, 202, 240);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 3;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(23, 198, 83);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 4;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(27, 132, 255);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div><div class="apexcharts-tooltip-series-group" style="order: 5;"><span class="apexcharts-tooltip-marker" style="background-color: rgb(196, 202, 218);"></span><div class="apexcharts-tooltip-text" style="font-family: inherit; font-size: 12px;"><div class="apexcharts-tooltip-y-group"><span class="apexcharts-tooltip-text-y-label"></span><span class="apexcharts-tooltip-text-y-value"></span></div><div class="apexcharts-tooltip-goals-group"><span class="apexcharts-tooltip-text-goals-label"></span><span class="apexcharts-tooltip-text-goals-value"></span></div><div class="apexcharts-tooltip-z-group"><span class="apexcharts-tooltip-text-z-label"></span><span class="apexcharts-tooltip-text-z-value"></span></div></div></div></div></div></div>
                                                        </div>
                                                        <div class="js-donut-legend d-flex flex-column justify-content-center flex-row-fluid pe-0 pe-sm-11 mb-5 min-w-200px mw-200px min-w-xl-250px mw-xl-250px">
                                                     <div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-danger me-3"></div>
<div class="text-gray-500">HTML</div>
<div class="ms-auto fw-bold text-gray-500">0.04MB</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-cyan me-3"></div>
<div class="text-gray-500">CSS</div>
<div class="ms-auto fw-bold text-gray-500">0.05MB</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-success me-3"></div>
<div class="text-gray-500">JS</div>
<div class="ms-auto fw-bold text-gray-500">2.64MB</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-primary me-3"></div>
<div class="text-gray-500">Images</div>
<div class="ms-auto fw-bold text-gray-500">0.1MB</div>
</div><div class="d-flex fs-6 fs-pdf-7 fw-semibold align-items-center text-start mb-3">
<div class="bullet bg-gray-400 me-3"></div>
<div class="text-gray-500">Other</div>
<div class="ms-auto fw-bold text-gray-500">1.39MB</div>
</div></div>
                                                </div>
                                            </div>
                                        </div></div></div> 
        <div class="check-info" style="display: none"><p class="what">Download Page Size refers to the total amount of file content that needs to be downloaded by the browser to view a particular webpage. This includes HTML, CSS, Javascript and Images, though can include a number of other file formats. Generally media files like images and videos are significantly larger than text files and make up the bulk of Download File Size, but also represent the largest optimization opportunity. An important distinction here is 'Download' vs 'Raw' file size. Modern web protocols compress files during transfer, meaning files are usually smaller to download than their actual or 'raw' size. So any manual optimizations you perform would be on the 'raw' file. Download Page Size is one of the biggest contributors to Page Load Speed, which can directly affect rankings, user experience and conversions.</p><p class="how">It is important to ensure your Download File Size is as small as possible by removing unnecessary files and minifying and optimizing others. 5MB is a good metric to strive for, though modern websites are gradually increasing in size.</p><p class="more-info"><a href="/blog/webpage-size/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasGzip">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Compression Usage (Gzip, Deflate, Brotli)</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="charts"></div> 
        </div><div class="faq-box row-hidden field-hasGzip expandable" id="hasGzip62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Compression Usage (Gzip, Deflate, Brotli)</h5>
                    <div class="answer field-value">Your website appears to be using a reasonable level of compression.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="charts"><div class="row mb-4 avoid-break-inside ">            <div class="col-12 col-xl-6">                <div class="avoid-break-inside text-center d-flex flex-wrap flex-center">                    <div class="fs-2 fs-pdf-4 my-5 text-center w-100">Compression Rate</div>                     <div class="position-relative canvas-label" style="min-width: 370px;">                        <div class="position-absolute translate-middle start-50 top-50 d-flex flex-column flex-center">                            <span class="fw-bolder text-gray-700" style="font-size: 24.6667px; padding-top: 46px;">80%</span>                        </div>                        <canvas class="compression-page-size mt-n15" width="370" height="230" id="hasGzip62508487compression-page-size" style="cursor: default;"></canvas>                    </div>                </div>            </div>            <div class="col-11 col-sm-10 offset-sm-1 col-xl-6 offset-xl-0">                <div class="avoid-break-inside d-flex flex-column compression-rates">                    <div class="fs-2 fs-pdf-4 my-5 text-center">Compression Rates</div>                    <div class="compression-percentage2" width="100" height="250"><div class="d-flex mw-450px flex-column mx-auto"><div class="d-flex flex-stack flex-wrap flex-sm-nowrap fs-7">                 
                <div class="d-flex align-items-center me-3">
                    <div class="min-w-65px">
                        <span class="text-gray-500 fw-semibold d-block fs-7">HTML</span>
                    </div>                   
                </div>                   
                <div class="d-flex align-items-center flex-grow-1 pe-0 pe-xxl-2">  
                    <div class="progress h-10px w-100 me-2 bg-light-danger">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="text-gray-500 fw-semibold fs-7 fs-pdf-8 text-end text-sm-left w-100 w-sm-unset me-2 me-sm-0 text-nowrap min-w-180px min-w-lg-200px min-w-pdf-250px">
                    <span class="text-gray-700 fw-bolder">75% </span>
                    compressed of 0.15MB                </div>
            </div><div class="separator separator-dashed my-2 my-sm-3"></div><div class="d-flex flex-stack flex-wrap flex-sm-nowrap fs-7">                 
                <div class="d-flex align-items-center me-3">
                    <div class="min-w-65px">
                        <span class="text-gray-500 fw-semibold d-block fs-7">CSS</span>
                    </div>                   
                </div>                   
                <div class="d-flex align-items-center flex-grow-1 pe-0 pe-xxl-2">  
                    <div class="progress h-10px w-100 me-2 bg-light-cyan">
                        <div class="progress-bar bg-cyan" role="progressbar" style="width: 11%" aria-valuenow="11" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="text-gray-500 fw-semibold fs-7 fs-pdf-8 text-end text-sm-left w-100 w-sm-unset me-2 me-sm-0 text-nowrap min-w-180px min-w-lg-200px min-w-pdf-250px">
                    <span class="text-gray-700 fw-bolder">89% </span>
                    compressed of 0.49MB                </div>
            </div><div class="separator separator-dashed my-2 my-sm-3"></div><div class="d-flex flex-stack flex-wrap flex-sm-nowrap fs-7">                 
                <div class="d-flex align-items-center me-3">
                    <div class="min-w-65px">
                        <span class="text-gray-500 fw-semibold d-block fs-7">JS</span>
                    </div>                   
                </div>                   
                <div class="d-flex align-items-center flex-grow-1 pe-0 pe-xxl-2">  
                    <div class="progress h-10px w-100 me-2 bg-light-success">
                        <div class="progress-bar bg-success" role="progressbar" style="width: 14%" aria-valuenow="14" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="text-gray-500 fw-semibold fs-7 fs-pdf-8 text-end text-sm-left w-100 w-sm-unset me-2 me-sm-0 text-nowrap min-w-180px min-w-lg-200px min-w-pdf-250px">
                    <span class="text-gray-700 fw-bolder">86% </span>
                    compressed of 18.84MB                </div>
            </div><div class="separator separator-dashed my-2 my-sm-3"></div><div class="d-flex flex-stack flex-wrap flex-sm-nowrap fs-7">                 
                <div class="d-flex align-items-center me-3">
                    <div class="min-w-65px">
                        <span class="text-gray-500 fw-semibold d-block fs-7">Images</span>
                    </div>                   
                </div>                   
                <div class="d-flex align-items-center flex-grow-1 pe-0 pe-xxl-2">  
                    <div class="progress h-10px w-100 me-2 bg-light-primary">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: 88%" aria-valuenow="88" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="text-gray-500 fw-semibold fs-7 fs-pdf-8 text-end text-sm-left w-100 w-sm-unset me-2 me-sm-0 text-nowrap min-w-180px min-w-lg-200px min-w-pdf-250px">
                    <span class="text-gray-700 fw-bolder">12% </span>
                    compressed of 0.11MB                </div>
            </div><div class="separator separator-dashed my-2 my-sm-3"></div><div class="d-flex flex-stack flex-wrap flex-sm-nowrap fs-7">                 
                <div class="d-flex align-items-center me-3">
                    <div class="min-w-65px">
                        <span class="text-gray-500 fw-semibold d-block fs-7">Other</span>
                    </div>                   
                </div>                   
                <div class="d-flex align-items-center flex-grow-1 pe-0 pe-xxl-2">  
                    <div class="progress h-10px w-100 me-2" style="background-color: rgba(var(--bs-gray-400-rgb), 0.2);">                        <div class="progress-bar bg-gray-400" role="progressbar" style="width: 72%" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="text-gray-500 fw-semibold fs-7 fs-pdf-8 text-end text-sm-left w-100 w-sm-unset me-2 me-sm-0 text-nowrap min-w-180px min-w-lg-200px min-w-pdf-250px">
                    <span class="text-gray-700 fw-bolder">28% </span>
                    compressed of 1.93MB                </div>
            </div><div class="separator separator-dashed my-2 my-sm-3"></div><div class="d-flex flex-stack flex-wrap flex-sm-nowrap fs-7">                 
                <div class="d-flex align-items-center me-3">
                    <div class="min-w-65px">
                        <span class="text-gray-700 fw-bolder d-block fs-7">Total</span>
                    </div>                   
                </div>                   
                <div class="d-flex align-items-center flex-grow-1 pe-0 pe-xxl-2">  
                    <div class="progress h-10px w-100 me-2 bg-light-info">
                        <div class="progress-bar bg-info" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <div class="text-gray-700 fw-bolder fs-7 fs-pdf-8 text-end text-sm-left w-100 w-sm-unset me-2 me-sm-0 text-nowrap min-w-180px min-w-lg-200px min-w-pdf-250px">
                    <span class="text-gray-700 fw-bolder">80% </span>
                    compressed of 21.53MB                </div>
            </div></div></div>                </div>            </div>        </div></div> 
        <div class="check-info" style="display: none"><p class="what">Modern web servers allow website files to be compressed as part of their transfer, often dramatically reducing the Download File Size and Page Load Speed of a page. There are several different compression algorithms used such as GZIP, Deflate and Brotli. Enabling compression can often represent a simple and quick win to performance, and most new web servers will have this enabled by default.</p><p class="how">You should ensure that compression is enabled and working effectively on your web server. Sometimes compression may only be partially enabled for particular file types, or using an older compression method, so it is important to understand whether your server is configured as efficiently as possible. This may require the help of a developer to investigate.</p><p class="more-info"><a href="/blog/webpage-size/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-numberOfResources">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Resources Breakdown</h5>
                    <div class="page-objects-info avoid-break-inside"><div class="answer field-value"></div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
             
        </div><div class="faq-box row-hidden field-numberOfResources expandable" id="numberOfResources62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Resources Breakdown</h5>
                    <div class="page-objects-info avoid-break-inside"><div class="answer field-value">This check displays the total number of files that need to be retrieved from web servers to load your page.<div class="resources-breakdown mt-8 mb-1"><div class="activity-item" align="center">              <div class="item-image ps-total-resources-image"></div>              <div class="item-content">                  <p class="value-item">180</p>                  <p class="title-item mb-0">Total Objects</p>            </div>        </div><div class="activity-item" align="center">              <div class="item-image ps-html-size-image"></div>              <div class="item-content">                  <p class="value-item">3</p>                  <p class="title-item mb-0">Number of HTML Pages</p>            </div>        </div><div class="activity-item" align="center">              <div class="item-image ps-js-resources-image"></div>              <div class="item-content">                  <p class="value-item">112</p>                  <p class="title-item mb-0">Number of JS Resources</p>            </div>        </div><div class="activity-item" align="center">              <div class="item-image ps-css-resources-image"></div>              <div class="item-content">                  <p class="value-item">15</p>                  <p class="title-item mb-0">Number of CSS Resources</p>            </div>        </div><div class="activity-item" align="center">              <div class="item-image ps-image-size-image"></div>              <div class="item-content">                  <p class="value-item">6</p>                  <p class="title-item mb-0">Number of Images</p>            </div>        </div><div class="activity-item" align="center">              <div class="item-image ps-static-resources-image"></div>              <div class="item-content">                  <p class="value-item">44</p>                  <p class="title-item mb-0">Other Resources</p>            </div>        </div></div></div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
             
        <div class="check-info" style="display: none"><p class="what">When browsers display a modern website, they have to retrieve a wide variety of files including HTML, CSS, Javascript, Images and other media. As a general rule, every file that needs to be retrieved is another network request that needs to be made by the browser to the server, which can each face some connection overhead and add to Page Load Time.</p><p class="how"> It is a good idea to remove unnecessary files or consolidate smaller files with similar content like styles and scripts where possible to optimize performance.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasAmp">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Google Accelerated Mobile Pages (AMP)</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"></div> 
        </div><div class="faq-box row-hidden field-hasAmp expandable" id="hasAmp62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Google Accelerated Mobile Pages (AMP)</h5>
                    <div class="answer field-value">This page does not appear to have AMP Enabled.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"><div class="js-collapse-parent">
   <a class="btn btn-light btn-sm js-collapse-in">Show Details</a>
   <div class="js-collapse-target collapse">
       <div class="answer headers field-value-table"><div class="table-part table-responsive">
           <div class="col-md-6 p-0">
               <table class="table table-row-dashed">
                   <thead>
                       <tr>
                           <th>AMP Indicator</th>
                           <th></th>
                       </tr>
                   </thead>
                   <tbody>
<tr><td>AMP Related Doctype Declaration</td><td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td></tr><tr><td>AMP Runtime</td><td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td></tr><tr><td>AMP CSS Boilerplate</td><td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td></tr><tr><td>Embedded Inline Custom CS</td><td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td></tr><tr><td>AMP Images</td><td><i class="ki-duotone fs-1 ki-cross text-danger"><span class="path1"></span><span class="path2"></span></i></td></tr><tr><td>AMP HTML Canonical Link</td><td><i class="ki-duotone fs-1 ki-check text-success"><span class="path1"></span><span class="path2"></span></i></td></tr></tbody></table></div></div></div>
       <a class="btn btn-light btn-sm js-collapse-out mt-3">Hide Details</a>
   </div>
</div></div> 
        <div class="check-info" style="display: none"><p class="what">AMP or Accelerated Mobile Pages, was an initiative originally created by Google to help mobile pages load faster through adherence to a specific set of requirements. Some research demonstrated that AMP enabled pages would receive  a ranking benefit. AMP has often been criticized and begun to be deprecated by particular browsers and frameworks.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-javascriptErrors">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">JavaScript Errors</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"></div> 
        </div><div class="faq-box row-hidden field-javascriptErrors expandable" id="javascriptErrors62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">JavaScript Errors</h5>
                    <div class="answer field-value">Your page is not reporting any JavaScript errors.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"></div> 
        <div class="check-info" style="display: none"><p class="what">JavaScript is embedded code on a webpage that can perform any number of functions such as modifying page elements dynamically, or making calls to retrieve information live without refreshing the page. JavaScript is a staple of the modern web and used on almost every modern website. However, with increasing usage and complexity, Javascript can fail on a page due to coding problems, incorrect versions or loading issues. Sometimes failures can interrupt proper execution of a page and break other functions, and so Javascript errors should generally be examined to understand the cause and what it's impacts are .</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-http">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">HTTP2 Usage</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
             
        </div><div class="faq-box row-hidden field-http expandable" id="http62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">HTTP2 Usage</h5>
                    <div class="answer field-value">Your website is using an outdated HTTP Protocol.<div class="append2">We recommend enabling HTTP/2+ Protocol for your website as it can significantly improve page load speed for users.</div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
             
        <div class="check-info" style="display: none"><p class="what">HTTP is a technology protocol used by web browser to communicate with websites and is a cornerstone of the world wide web. HTTP/2 (and above) are newer versions of the HTTP protocol that offer significant performance improvements. Older websites may be set to using an older HTTP protocol despite their web servers having been upgraded to support newer versions.</p><p class="how">It is worth reviewing whether your website is configured to use the latest available HTTP protocol as it can provide immediate Page Load Speed improvements.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasOptimizedImages">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Optimize Images</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"></div> 
        </div><div class="faq-box row-hidden field-hasOptimizedImages expandable" id="hasOptimizedImages62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Optimize Images</h5>
                    <div class="answer field-value">All of the images on your page appear to be optimized.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"></div> 
        <div class="check-info" style="display: none"><p class="what">Image and media files in general tend to be the largest component of file size on most modern webpages. File size can directly impact how quickly a page loads, and subsequently the quality of the experience for users. Images in general can have a large range in how much they can be optimized. For example, a high quality photograph downloaded from a camera could be 16MB, but using a reasonable level of size reduction and optimization could comfortably reduce it to 150KB without a noticeable amount of quality loss.</p><p class="how">Review the images used on your site, starting from the largest in file size to determine if there are optimization opportunities. You can use common image editing tools like Photoshop or even free online compression tools to optimize them.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasMinified js-collapse-parent">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Minification</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"></div> 
        </div><div class="faq-box row-hidden field-hasMinified js-collapse-parent expandable" id="hasMinified62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Minification</h5>
                    <div class="answer field-value">All your JavaScript and CSS files appear to be minified.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"></div> 
        <div class="check-info" style="display: none"><p class="what">Minification is a procedure run on code text files that can reduce the text size by removing white space and substituting common values or names with shorter versions. Minification also offers the additional value of making code much harder to read and reverse engineer by third parties. It is best practice to minify any exposed JS and CSS Files before publishing them to a live site.</p><p class="how"> Minification can be done automatically through some development tools and website build procedures, or through minification CMS Plugins, or manually through minification tools available online.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasDeprecated">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Deprecated HTML</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"></div> 
        </div><div class="faq-box row-hidden field-hasDeprecated expandable" id="hasDeprecated62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Deprecated HTML</h5>
                    <div class="answer field-value">No deprecated HTML tags have been found within your page.</div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x text-success ki-check mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details"></div> 
        <div class="check-info" style="display: none"><p class="what">HTML, like most coding languages, has had improvements made over time that has removed older features, either due to them simply being problematic, or more often replaced with something better. If you continue to use these older features in your page, you may at the bare minimum not get the expected functionality in your page, or in the worst case, break some execution. </p><p class="how">It is recommended to identify and remove any old or 'deprecated' tags from your code. This could be done manually if you have HTML or web design skills, or could be done by upgrading the template and library versions on your website.</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasInlineCss">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Inline Styles</h5>
                    <div class="answer field-value"></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details avoid-break-after"></div> 
        </div><div class="faq-box row-hidden field-hasInlineCss expandable" id="hasInlineCss62508487" style="display: block;">
            <div class="row avoid-break-inside">
                <div class="col-11">
                    <h5 class="question" data-wow-delay=".1s">Inline Styles</h5>
                    <div class="answer field-value">Your page appears to be using Inline Styles.<div class="append2">Inline Styles are an older coding practice and discouraged in favor of using CSS style sheets, due to their ability to degrade page load performance and unnecessarily complicate HTML Code.</div></div>
                </div>
                <div class="col-1 p-0 mh-45px">
                    <div class="widget-bg-color-icon">
                        <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="md ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                        </div>
                    </div>
                </div>
            </div>             
            <div class="field-details avoid-break-after"><div class="js-collapse-parent">
   <a class="btn btn-light btn-sm js-collapse-in">Show Details</a>
   <div class="js-collapse-target collapse">
       <div class="answer headers field-value-table">        <div class=" table-part"><table class="table table-row-dashed table-fluid table-wrapped">            <thead><tr>                <th style="width: 70px;">Line</th>                <th>Style</th>            </tr></thead>            <tbody>            <tr>                <td style="width: 70px;">1</td>                <td>display:none</td>            </tr>            <tr>                <td style="width: 70px;">12</td>                <td>margin:0;padding:0</td>            </tr>            <tr>                <td style="width: 70px;">12</td>                <td>font-family:system-ui, -apple-system, sans-serif;background:#0a0a0a;color:white</td>            </tr>            <tr>                <td style="width: 70px;">12</td>                <td>background:linear-gradient(90deg, #dc2626, #ea580c, #dc2626);padding:12px 20px;text-align:center;position:relative;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">12</td>                <td>position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);animation:shimmer 2s infinite</td>            </tr>            <tr>                <td style="width: 70px;">12</td>                <td>font-size:14px;font-weight:700;color:white;display:flex;align-items:center;justify-content:center;gap:8px;position:relative;z-index:1;text-decoration:none;transition:transform 0.2s ease</td>            </tr>            <tr>                <td style="width: 70px;">12</td>                <td>background:rgba(245, 158, 11, 0.3);padding:2px 10px;border-radius:4px;border:1px solid rgba(245, 158, 11, 0.5)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;padding:16px 60px;background:rgba(10, 10, 10, 0.95);backdrop-filter:blur(10px);position:sticky;top:0;z-index:1000;border-bottom:1px solid rgba(255,255,255,0.1)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:24px;font-weight:bold;color:white;display:flex;align-items:center;gap:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>width:32px;height:32px;border-radius:6px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:none;background:none;border:none;cursor:pointer;padding:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;gap:28px;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;font-weight:500</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;font-weight:500</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;font-weight:500</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#f59e0b;text-decoration:none;font-size:14px;font-weight:600;display:flex;align-items:center;gap:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;font-weight:500</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;font-weight:500</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:rgba(255,255,255,0.9);text-decoration:none;font-size:14px;font-weight:500</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>padding:10px 20px;background:white;color:#0a0a0a;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:6px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(180deg, #0a0a0a 0%, #111111 100%);padding:80px 60px 100px;position:relative;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>position:absolute;top:10%;left:10%;width:400px;height:400px;background:radial-gradient(circle, rgba(105, 63, 233, 0.15) 0%, transparent 70%);border-radius:50%;filter:blur(60px)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>position:absolute;bottom:20%;right:15%;width:300px;height:300px;background:radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);border-radius:50%;filter:blur(60px)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>max-width:1000px;margin:0 auto;position:relative;z-index:1</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:inline-block;background:rgba(105, 63, 233, 0.1);border:1px solid rgba(105, 63, 233, 0.3);padding:8px 16px;border-radius:20px;font-size:13px;margin-bottom:24px;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:6px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:52px;font-weight:800;line-height:1.15;margin-bottom:24px;letter-spacing:-1.5px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:18px;color:rgba(255,255,255,0.7);margin-bottom:20px;line-height:1.7;max-width:700px;margin:0 auto 20px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:14px;color:rgba(255,255,255,0.5);margin-bottom:24px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#10b981</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:24px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;gap:2px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#fbbf24;font-size:18px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#fbbf24;font-size:18px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#fbbf24;font-size:18px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#fbbf24;font-size:18px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#fbbf24;font-size:18px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:rgba(255,255,255,0.6);font-size:14px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;justify-content:center</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>padding:16px 32px;background:white;color:#0a0a0a;text-decoration:none;border-radius:10px;font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(255,255,255,0.2)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>padding:16px 32px;background:linear-gradient(135deg, #f59e0b, #d97706);color:white;text-decoration:none;border-radius:10px;font-size:16px;font-weight:600;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(245,158,11,0.4)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;gap:20px;flex-wrap:wrap;justify-content:center;margin-bottom:50px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>position:relative;max-width:900px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:rgba(255,255,255,0.05);border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);box-shadow:0 30px 100px rgba(0,0,0,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>position:relative;padding-bottom:56.25%;height:0</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>position:absolute;top:0;left:0;width:100%;height:100%;border-radius:20px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg, #693fe9, #7c4dff);padding:8px 20px;border-radius:20px;font-size:12px;font-weight:600;color:white;box-shadow:0 4px 15px rgba(105, 63, 233, 0.4)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-top:50px;color:rgba(255,255,255,0.3);font-size:13px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#0a0a0a;padding:80px 60px;border-top:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>max-width:1200px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:inline-block;background:rgba(99, 102, 241, 0.1);border:1px solid rgba(99, 102, 241, 0.3);padding:6px 14px;border-radius:16px;font-size:12px;margin-bottom:20px;color:#818cf8</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:38px;font-weight:700;margin-bottom:20px;line-height:1.2</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:16px;color:rgba(255,255,255,0.6);margin-bottom:30px;line-height:1.7</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:grid;grid-template-columns:1fr 1fr;gap:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:14px;border-radius:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:6px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-weight:600;margin-bottom:4px;font-size:14px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:14px;border-radius:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:6px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-weight:600;margin-bottom:4px;font-size:14px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:14px;border-radius:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:6px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-weight:600;margin-bottom:4px;font-size:14px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:14px;border-radius:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:6px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-weight:600;margin-bottom:4px;font-size:14px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:center</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>width:100%;max-width:580px;background:white;border-radius:16px;box-shadow:0 25px 80px rgba(0,0,0,0.4);overflow:hidden;border:1px solid rgba(255,255,255,0.1);flex-shrink:0;position:relative</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(135deg, #693fe9 0%, #7c4dff 100%);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;border-radius:14px;margin:12px;box-shadow:0 8px 24px rgba(105, 63, 233, 0.35)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>width:36px;height:36px;border-radius:10px;box-shadow:0 4px 12px rgba(0, 0, 0, 0.15)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:14px;font-weight:700;color:#ffffff</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:9px;color:rgba(255, 255, 255, 0.85);font-weight:500;letter-spacing:0.5px;text-transform:uppercase</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>padding:5px 12px;background:rgba(255, 255, 255, 0.2);border-radius:20px;font-size:10px;font-weight:600;color:#ffffff;backdrop-filter:blur(10px)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>opacity:0.8;margin-right:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>position:relative</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>position:absolute;top:-45px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg, #f59e0b, #d97706);color:white;padding:8px 16px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 4px 20px rgba(245, 158, 11, 0.5);z-index:10;animation:pulse 2s infinite</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #d97706</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;gap:3px;padding:6px 10px;background:linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));border-bottom:1px solid #e2e8f0;overflow-x:auto;-webkit-overflow-scrolling:touch;border:2px solid rgba(245, 158, 11, 0.5);border-radius:8px;margin:0 8px 0 8px;transition:all 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>flex:0 0 auto;padding:8px 10px;font-size:10px;font-weight:600;background:linear-gradient(135deg, #693fe9 0%, #7c4dff 100%);color:white;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;text-align:center;box-shadow:0 4px 12px rgba(105, 63, 233, 0.35);white-space:nowrap</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>flex:0 0 auto;padding:8px 10px;font-size:10px;font-weight:600;background:transparent;color:#64748B;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;text-align:center;box-shadow:none;white-space:nowrap</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>flex:0 0 auto;padding:8px 10px;font-size:10px;font-weight:600;background:transparent;color:#64748B;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;text-align:center;box-shadow:none;white-space:nowrap</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>flex:0 0 auto;padding:8px 10px;font-size:10px;font-weight:600;background:transparent;color:#64748B;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;text-align:center;box-shadow:none;white-space:nowrap</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>flex:0 0 auto;padding:8px 10px;font-size:10px;font-weight:600;background:transparent;color:#64748B;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;text-align:center;box-shadow:none;white-space:nowrap</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>flex:0 0 auto;padding:8px 10px;font-size:10px;font-weight:600;background:transparent;color:#64748B;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;text-align:center;box-shadow:none;white-space:nowrap</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>flex:0 0 auto;padding:8px 10px;font-size:10px;font-weight:600;background:transparent;color:#64748B;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;text-align:center;box-shadow:none;white-space:nowrap</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>flex:0 0 auto;padding:8px 10px;font-size:10px;font-weight:600;background:transparent;color:#64748B;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;text-align:center;box-shadow:none;white-space:nowrap</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>min-height:350px;max-height:450px;overflow-y:auto</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;margin-bottom:15px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>width:100%;height:20px;background-color:#f0f2f5;border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>height:100%;background:#693fe9;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-top:8px;font-size:11px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:15px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:grid;grid-template-columns:repeat(5, 1fr);gap:10px;margin-bottom:15px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(135deg, #693fe9 0%, #7c4dff 100%);padding:14px 8px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(105, 63, 233, 0.3)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:18px;font-weight:700;color:white;margin-bottom:2px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;opacity:0.8</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:9px;color:rgba(255, 255, 255, 0.95);text-transform:uppercase;font-weight:600;letter-spacing:0.5px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(135deg, #EC4899 0%, #DB2777 100%);padding:14px 8px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(236, 72, 153, 0.3)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:18px;font-weight:700;color:white;margin-bottom:2px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;opacity:0.8</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:9px;color:rgba(255, 255, 255, 0.95);text-transform:uppercase;font-weight:600;letter-spacing:0.5px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);padding:14px 8px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(6, 182, 212, 0.3)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:18px;font-weight:700;color:white;margin-bottom:2px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;opacity:0.8</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:9px;color:rgba(255, 255, 255, 0.95);text-transform:uppercase;font-weight:600;letter-spacing:0.5px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(135deg, #693fe9 0%, #5835c7 100%);padding:14px 8px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(105, 63, 233, 0.3)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:18px;font-weight:700;color:white;margin-bottom:2px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;opacity:0.8</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:9px;color:rgba(255, 255, 255, 0.95);text-transform:uppercase;font-weight:600;letter-spacing:0.5px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(135deg, #F59E0B 0%, #D97706 100%);padding:14px 8px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(245, 158, 11, 0.3)</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:18px;font-weight:700;color:white;margin-bottom:2px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;opacity:0.8</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:9px;color:rgba(255, 255, 255, 0.95);text-transform:uppercase;font-weight:600;letter-spacing:0.5px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;padding-top:15px;border-top:1px solid #e0e0e0;margin-top:15px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:13px;display:block;margin-bottom:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;background:linear-gradient(135deg, #f0f8ff 0%, #e6f0ff 100%);padding:10px 12px;border-radius:8px;margin-bottom:8px;border-left:4px solid #693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;justify-content:space-between</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-weight:600;font-size:12px;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:10px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#dc3545;color:white;border:none;padding:5px 10px;border-radius:4px;font-size:10px;cursor:pointer;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;background:linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%);padding:10px 12px;border-radius:8px;margin-bottom:8px;border-left:4px solid #f59e0b</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;justify-content:space-between</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-weight:600;font-size:12px;color:#f59e0b</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:10px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#dc3545;color:white;border:none;padding:5px 10px;border-radius:4px;font-size:10px;cursor:pointer;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);padding:10px 12px;border-radius:8px;margin-bottom:8px;border-left:4px solid #22c55e</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;justify-content:space-between</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-weight:600;font-size:12px;color:#22c55e</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:10px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#dc3545;color:white;border:none;padding:5px 10px;border-radius:4px;font-size:10px;cursor:pointer;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;background:linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%);padding:10px 12px;border-radius:8px;margin-bottom:8px;border-left:4px solid #a855f7</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;justify-content:space-between</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-weight:600;font-size:12px;color:#a855f7</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:10px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>width:20px;height:20px;border:2px solid #e0e0e0;border-top-color:#a855f7;border-radius:50%;animation:spin 1s linear infinite</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>padding-top:15px;border-top:1px solid #e0e0e0;margin-top:15px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;justify-content:space-between;margin-bottom:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;color:#666;background:#f0f0f0;padding:2px 8px;border-radius:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>max-height:200px;overflow-y:auto</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;background:linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);padding:10px 12px;border-radius:8px;margin-top:10px;border-left:4px solid #f59e0b</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-weight:600;font-size:11px;color:#f59e0b</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:10px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;padding-top:15px;border-top:1px solid #e0e0e0;position:relative;z-index:1000;background:white;margin-top:15px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;justify-content:space-between;margin-bottom:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;align-items:center;gap:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#693fe9;font-weight:600;font-size:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;background:#ff4444;color:white;border:none;padding:4px 8px;border-radius:4px;font-size:10px;cursor:pointer;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>width:100%;height:28px;background:#e0e0e0;border-radius:14px;overflow:hidden;margin-bottom:6px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>height:100%;background:linear-gradient(90deg, #693fe9, #693fe9);width:0%;transition:width 0.3s ease;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;color:#666;text-align:center;margin-bottom:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;background:#f8f9fa;padding:10px;border-radius:8px;margin-bottom:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:600;margin-bottom:6px;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-top:6px;font-size:10px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;background:#f8f9fa;padding:10px;border-radius:8px;margin-bottom:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:600;margin-bottom:6px;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-top:6px;font-size:10px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:block;font-size:10px;color:#666</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;margin-bottom:2px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#ccc</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;margin-bottom:2px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#ccc</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;margin-bottom:2px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#ccc</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>color:#ccc</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:grid;grid-template-columns:repeat(2, 1fr);gap:8px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;margin-bottom:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;font-weight:600;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:700;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#f0f2f5;border-radius:10px;height:8px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(90deg, #693fe9 0%, #7c4dff 100%);height:100%;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;margin-bottom:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;font-weight:600;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:700;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#f0f2f5;border-radius:10px;height:8px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(90deg, #f093fb 0%, #f5576c 100%);height:100%;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;margin-bottom:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;font-weight:600;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:700;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#f0f2f5;border-radius:10px;height:8px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);height:100%;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;margin-bottom:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;font-weight:600;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:700;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#f0f2f5;border-radius:10px;height:8px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);height:100%;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;margin-bottom:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;font-weight:600;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:700;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#f0f2f5;border-radius:10px;height:8px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(90deg, #fa709a 0%, #fee140 100%);height:100%;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;margin-bottom:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;font-weight:600;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:700;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#f0f2f5;border-radius:10px;height:8px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(90deg, #fbc2eb 0%, #a18cd1 100%);height:100%;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;margin-bottom:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;font-weight:600;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:700;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#f0f2f5;border-radius:10px;height:8px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(90deg, #ff9a9e 0%, #ff6b6b 100%);height:100%;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;margin-bottom:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;font-weight:600;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:700;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#f0f2f5;border-radius:10px;height:8px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(90deg, #ffeaa7 0%, #ffd93d 100%);height:100%;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>display:flex;justify-content:space-between;align-items:center;margin-bottom:4px</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:12px;font-weight:600;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>font-size:11px;font-weight:700;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:#f0f2f5;border-radius:10px;height:8px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">73</td>                <td>background:linear-gradient(90deg, #38d9a9 0%, #20c997 100%);height:100%;width:0%;transition:width 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:#111111;padding:80px 60px;border-top:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>max-width:1000px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>text-align:center;margin-bottom:50px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-block;background:rgba(245, 158, 11, 0.1);border:1px solid rgba(245, 158, 11, 0.3);padding:6px 14px;border-radius:16px;font-size:12px;margin-bottom:20px;color:#f59e0b</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:6px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:38px;font-weight:700;margin-bottom:20px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;margin-bottom:40px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:rgba(255,255,255,0.8);line-height:1.8;margin-bottom:24px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#f59e0b</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:grid;grid-template-columns:repeat(3, 1fr);gap:16px;margin-bottom:24px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:8px;padding:12px;background:rgba(105, 63, 233, 0.1);border-radius:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:8px;padding:12px;background:rgba(105, 63, 233, 0.1);border-radius:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:8px;padding:12px;background:rgba(105, 63, 233, 0.1);border-radius:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:8px;padding:12px;background:rgba(105, 63, 233, 0.1);border-radius:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:8px;padding:12px;background:rgba(105, 63, 233, 0.1);border-radius:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:8px;padding:12px;background:rgba(105, 63, 233, 0.1);border-radius:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:16px;color:rgba(255,255,255,0.6);text-align:center;margin-bottom:24px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>text-align:center;padding:24px;background:linear-gradient(135deg, rgba(105, 63, 233, 0.2), rgba(99, 102, 241, 0.1));border-radius:12px;border:1px solid rgba(105, 63, 233, 0.3)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:20px;font-weight:700;color:white;margin-bottom:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:16px;color:rgba(255,255,255,0.7)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:grid;grid-template-columns:repeat(3, 1fr);gap:20px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:16px;font-weight:600;margin-bottom:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:13px;color:rgba(255,255,255,0.5);line-height:1.5</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:16px;font-weight:600;margin-bottom:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:13px;color:rgba(255,255,255,0.5);line-height:1.5</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:16px;font-weight:600;margin-bottom:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:13px;color:rgba(255,255,255,0.5);line-height:1.5</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:#0a0a0a;padding:100px 60px;border-top:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>max-width:1200px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>text-align:center;margin-bottom:60px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-block;background:rgba(105, 63, 233, 0.1);border:1px solid rgba(105, 63, 233, 0.3);padding:6px 14px;border-radius:16px;font-size:12px;margin-bottom:20px;color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:42px;font-weight:700;margin-bottom:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:rgba(255,255,255,0.5);max-width:600px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:grid;grid-template-columns:repeat(3, 1fr);gap:30px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:32px 28px;text-align:center;position:relative;transition:transform 0.3s, border-color 0.3s</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:absolute;top:-16px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg, #693fe9, #8b5cf6);width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:white;box-shadow:0 4px 15px rgba(0,0,0,0.3)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:70px;height:70px;background:rgba(255,255,255,0.05);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:24px auto 20px auto;border:1px solid rgba(255,255,255,0.1)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:20px;font-weight:600;margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.5);margin:0;line-height:1.6</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:32px 28px;text-align:center;position:relative;transition:transform 0.3s, border-color 0.3s</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:absolute;top:-16px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg, #f59e0b, #fbbf24);width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:white;box-shadow:0 4px 15px rgba(0,0,0,0.3)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:70px;height:70px;background:rgba(255,255,255,0.05);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:24px auto 20px auto;border:1px solid rgba(255,255,255,0.1)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:20px;font-weight:600;margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.5);margin:0;line-height:1.6</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:32px 28px;text-align:center;position:relative;transition:transform 0.3s, border-color 0.3s</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:absolute;top:-16px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg, #22c55e, #10b981);width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:white;box-shadow:0 4px 15px rgba(0,0,0,0.3)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:70px;height:70px;background:rgba(255,255,255,0.05);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:24px auto 20px auto;border:1px solid rgba(255,255,255,0.1)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:20px;font-weight:600;margin-bottom:12px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.5);margin:0;line-height:1.6</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:#111111;padding:80px 60px;border-top:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>max-width:900px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:linear-gradient(135deg, rgba(105, 63, 233, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%);border:1px solid rgba(105, 63, 233, 0.3);border-radius:24px;padding:60px 50px;text-align:center;position:relative;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:absolute;top:-50px;right:-50px;width:200px;height:200px;background:radial-gradient(circle, rgba(105, 63, 233, 0.2) 0%, transparent 70%);border-radius:50%</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:absolute;bottom:-30px;left:-30px;width:150px;height:150px;background:radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);border-radius:50%</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:relative;z-index:1</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:8px;background:rgba(105, 63, 233, 0.2);border:1px solid rgba(105, 63, 233, 0.4);padding:8px 18px;border-radius:30px;font-size:13px;margin-bottom:24px;color:#a78bfa</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:42px;font-weight:800;margin-bottom:20px;line-height:1.2</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:17px;color:rgba(255,255,255,0.7);margin-bottom:20px;line-height:1.7;max-width:600px;margin:0 auto 20px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:32px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);padding:10px 18px;border-radius:30px;font-size:13px;color:rgba(255,255,255,0.8);font-weight:400;box-shadow:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg, #f59e0b, #d97706);padding:10px 18px;border-radius:30px;font-size:13px;color:white;font-weight:600;box-shadow:0 4px 15px rgba(245, 158, 11, 0.4)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);padding:10px 18px;border-radius:30px;font-size:13px;color:rgba(255,255,255,0.8);font-weight:400;box-shadow:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.08);padding:10px 18px;border-radius:30px;font-size:13px;color:rgba(255,255,255,0.8);font-weight:400;box-shadow:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:10px;padding:16px 36px;background:linear-gradient(135deg, #693fe9, #8b5cf6);color:white;text-decoration:none;border-radius:12px;font-size:16px;font-weight:600;box-shadow:0 8px 30px rgba(105, 63, 233, 0.4);transition:transform 0.3s, box-shadow 0.3s</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:#111111;padding:80px 60px;border-top:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>max-width:1200px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>text-align:center;margin-bottom:50px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-block;background:rgba(16, 185, 129, 0.1);border:1px solid rgba(16, 185, 129, 0.3);padding:6px 14px;border-radius:16px;font-size:12px;margin-bottom:20px;color:#10b981</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:38px;font-weight:700;margin-bottom:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:16px;color:rgba(255,255,255,0.5);max-width:600px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:grid;grid-template-columns:repeat(3, 1fr);gap:24px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;position:relative</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:absolute;top:-12px;left:20px;background:#10b981;color:white;padding:4px 12px;border-radius:12px;font-size:11px;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;gap:4px;margin-bottom:16px;margin-top:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;margin-bottom:20px;font-style:italic</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:12px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg, #3b82f6, #1d4ed8);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:white</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-weight:600;font-size:14px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-top:16px;padding:12px;background:rgba(16, 185, 129, 0.1);border-radius:8px;display:flex;justify-content:space-around;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;font-weight:700;color:#10b981</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:10px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;font-weight:700;color:#10b981</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:10px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;font-weight:700;color:#10b981</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:10px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:linear-gradient(180deg, rgba(105, 63, 233, 0.1) 0%, rgba(105, 63, 233, 0.03) 100%);border:2px solid #693fe9;border-radius:16px;padding:28px;position:relative</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:absolute;top:-12px;left:20px;background:linear-gradient(135deg, #693fe9, #8b5cf6);color:white;padding:4px 12px;border-radius:12px;font-size:11px;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;gap:4px;margin-bottom:16px;margin-top:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;margin-bottom:20px;font-style:italic</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:12px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg, #10b981, #059669);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:white</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-weight:600;font-size:14px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-top:16px;padding:12px;background:rgba(105, 63, 233, 0.15);border-radius:8px;display:flex;justify-content:space-around;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;font-weight:700;color:#a78bfa</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:10px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;font-weight:700;color:#a78bfa</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:10px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;font-weight:700;color:#a78bfa</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:10px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;position:relative</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:absolute;top:-12px;left:20px;background:linear-gradient(135deg, #f59e0b, #d97706);color:white;padding:4px 12px;border-radius:12px;font-size:11px;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;gap:4px;margin-bottom:16px;margin-top:8px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#fbbf24;font-size:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;margin-bottom:20px;font-style:italic</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;align-items:center;gap:12px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg, #f59e0b, #d97706);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:white</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-weight:600;font-size:14px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:12px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-top:16px;padding:12px;background:rgba(245, 158, 11, 0.1);border-radius:8px;display:flex;justify-content:space-around;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;font-weight:700;color:#fbbf24</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:10px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;font-weight:700;color:#fbbf24</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:10px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;font-weight:700;color:#fbbf24</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:10px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>text-align:center;margin-top:40px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:linear-gradient(135deg, #693fe9, #8b5cf6);color:white;text-decoration:none;border-radius:10px;font-size:15px;font-weight:600;box-shadow:0 4px 20px rgba(105, 63, 233, 0.4)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:#0a0a0a;padding:80px 60px;border-top:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>max-width:1200px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>text-align:center;margin-bottom:50px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-block;background:rgba(16, 185, 129, 0.1);border:1px solid rgba(16, 185, 129, 0.3);padding:6px 14px;border-radius:16px;font-size:12px;margin-bottom:20px;color:#10b981</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:38px;font-weight:700;margin-bottom:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:16px;color:rgba(255,255,255,0.5);max-width:700px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>overflow-x:auto;margin-bottom:40px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;border-collapse:collapse;min-width:800px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(105, 63, 233, 0.1)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);font-size:14px;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);font-size:14px;font-weight:600;background:rgba(105, 63, 233, 0.2);color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);font-size:14px;font-weight:600;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);font-size:14px;font-weight:600;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:16px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);font-size:14px;font-weight:600;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>border-bottom:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;font-size:13px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center;background:rgba(105, 63, 233, 0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:13px;font-weight:600;color:#10b981</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:12px;color:rgba(255,255,255,0.4)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:12px;color:rgba(255,255,255,0.4)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:12px;color:rgba(255,255,255,0.4)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>border-bottom:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;font-size:13px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center;background:rgba(105, 63, 233, 0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>border-bottom:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;font-size:13px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center;background:rgba(105, 63, 233, 0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>border-bottom:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;font-size:13px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center;background:rgba(105, 63, 233, 0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>border-bottom:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;font-size:13px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center;background:rgba(105, 63, 233, 0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>border-bottom:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;font-size:13px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center;background:rgba(105, 63, 233, 0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>border-bottom:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;font-size:13px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center;background:rgba(105, 63, 233, 0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>padding:14px 16px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:rgba(105, 63, 233, 0.1);border:1px solid rgba(105, 63, 233, 0.3);border-radius:12px;padding:24px;text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:#693fe9;color:white;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:#111111;padding:80px 60px;border-top:1px solid rgba(255,255,255,0.05)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>max-width:800px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>text-align:center;margin-bottom:50px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:38px;font-weight:700;margin-bottom:16px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>margin-bottom:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>width:100%;padding:16px 20px;background:transparent;border:none;text-align:left;font-size:15px;font-weight:500;color:white;cursor:pointer;display:flex;justify-content:space-between;align-items:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:18px;color:#693fe9;transition:transform 0.3s;transform:none</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>background:#0a0a0a;padding:80px 60px;border-top:1px solid rgba(255,255,255,0.05);text-align:center</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>max-width:700px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:38px;font-weight:700;margin-bottom:20px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:16px;color:rgba(255,255,255,0.5);margin-bottom:32px;line-height:1.7</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:24px</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:8px;padding:16px 32px;background:white;color:#0a0a0a;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>display:inline-flex;align-items:center;gap:8px;padding:16px 32px;background:linear-gradient(135deg, #f59e0b, #d97706);color:white;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>font-size:14px;color:rgba(255,255,255,0.5)</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>color:#693fe9;text-decoration:underline</td>            </tr>            <tr>                <td style="width: 70px;">78</td>                <td>position:fixed;bottom:24px;right:24px;width:60px;height:60px;background:#25D366;border-radius:50%;border:none;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37, 211, 102, 0.4);z-index:9999;cursor:pointer;transition:transform 0.3s ease, box-shadow 0.3s ease</td>            </tr>            <tr>                <td style="width: 70px;">151</td>                <td>padding:50px 60px 30px;background:#050505;border-top:1px solid rgba(255,255,255,0.05);color:white</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>max-width:1200px;margin:0 auto</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>display:grid;grid-template-columns:repeat(4, 1fr);gap:40px;margin-bottom:40px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>display:flex;align-items:center;gap:8px;margin-bottom:15px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>width:32px;height:32px;border-radius:6px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>font-size:18px;font-weight:600</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>font-size:14px;font-weight:600;margin-bottom:15px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>display:flex;flex-direction:column;gap:10px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:#f59e0b;text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>font-size:14px;font-weight:600;margin-bottom:15px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>display:flex;flex-direction:column;gap:10px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:#22c55e;text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>font-size:14px;font-weight:600;margin-bottom:15px;color:rgba(255,255,255,0.8)</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>display:flex;flex-direction:column;gap:10px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>font-size:12px;color:rgba(255,255,255,0.3)</td>            </tr>            <tr>                <td style="width: 70px;">183</td>                <td>font-size:11px;color:rgba(255,255,255,0.25)</td>            </tr></tbody></table></div></div>
       <a class="btn btn-light btn-sm js-collapse-out mt-3">Hide Details</a>
   </div>
</div></div> 
        <div class="check-info" style="display: none"><p class="what">HTML provides the ability to embed UI styling attributes within individual HTML elements. Despite this feature being available, it is modern best practice to completely separate UI styling into separate CSS files. This separates functions and centralises UI styling into one place making it easier for example to upgrade the UI styling of a site independently of the page content and structure. Inline Styles also have some particular problems in that they can degrade the page load performance of a page and unnecessarily complicate HTML code.</p><p class="how">Inline Styles should be manually removed from the HTML code of a page and merged into separate CSS files, but may need the help of a designer to carefully consider their purpose and function.</p></div></div>
    </div>                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                        <div class="container-check block tab-social" style="">
    <div class="row g-5 gx-xl-10 mb-5 mb-xl-10" id="social">
        <div class="col-xxl-12 position-relative">
            <div class="portlet card card-flush">
                <div class="portlet-heading card-header pt-7 border-bottom-0 without-js-header-container avoid-break-inside avoid-break-after">
                    <h2 class="section-title">
                        <span class="card-label fw-bold">
                            Social Results                        </span>
                    </h2>
                </div>
                <div class="portlet-body card-body pt-0 pt-md-6 pb-4 pb-md-8">
                    <div class="row">
                        <div class="col-md-3 col-12 col-pdf-3">
                            <div class="text-center w-100">
                                <style>
    :root{
        --section-score-chart-size: 190px;
    }
</style>
<div class="score-graph-wrapper mt-n4 mb-6 mb-md-0 w-100">
    <div class="knob social-score check-score" style="width: 100%; visibility: visible; -webkit-text-fill-color: var(--bs-primary); min-height: 191px;" data-value="0" data-width="190" data-height="190" data-fgcolor="primary" data-label="F"><div id="apexchartstycn7ys5" class="apexcharts-canvas apexchartstycn7ys5 apexcharts-theme-light" style="width: 184px; height: 191px;"><svg id="SvgjsSvg9630" width="184" height="191" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;"><foreignObject x="0" y="0" width="184" height="191"><div class="apexcharts-legend" xmlns="http://www.w3.org/1999/xhtml"></div></foreignObject><g id="SvgjsG9632" class="apexcharts-inner apexcharts-graphical" transform="translate(-3, 1)"><defs id="SvgjsDefs9631"><clipPath id="gridRectMasktycn7ys5"><rect id="SvgjsRect9633" width="196" height="200" x="-4" y="-6" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath><clipPath id="forecastMasktycn7ys5"></clipPath><clipPath id="nonForecastMasktycn7ys5"></clipPath><clipPath id="gridRectMarkerMasktycn7ys5"><rect id="SvgjsRect9634" width="194" height="192" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect></clipPath></defs><g id="SvgjsG9635" class="apexcharts-radialbar"><g id="SvgjsG9636"><g id="SvgjsG9637" class="apexcharts-tracks"><g id="SvgjsG9638" class="apexcharts-radialbar-track apexcharts-track" rel="1"><path id="apexcharts-radialbarTrack-0" d="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 94.9877592823448 23.865854726740707" fill="none" fill-opacity="1" stroke="rgba(233,243,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.04878048780488" stroke-dasharray="0" class="apexcharts-radialbar-area" data:pathOrig="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 1 1 94.9877592823448 23.865854726740707"></path></g></g><g id="SvgjsG9640"><g id="SvgjsG9644" class="apexcharts-series apexcharts-radial-series" seriesName="series-1" rel="1" data:realIndex="0"><path id="SvgjsPath9645" d="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 0 1 95 23.86585365853658" fill="none" fill-opacity="0.85" stroke="rgba(27,132,255,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="11.04878048780488" stroke-dasharray="0" class="apexcharts-radialbar-area apexcharts-radialbar-slice-0" data:angle="0" data:value="0" index="0" j="0" data:pathOrig="M 95 23.86585365853658 A 70.13414634146342 70.13414634146342 0 0 1 95 23.86585365853658"></path></g><circle id="SvgjsCircle9641" r="64.60975609756098" cx="95" cy="94" class="apexcharts-radialbar-hollow" fill="transparent"></circle><g id="SvgjsG9642" class="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style="opacity: 1;"><text id="SvgjsText9643" font-family="inherit" x="95" y="106" text-anchor="middle" dominant-baseline="auto" font-size="30px" font-weight="700" fill="#4b5675" class="apexcharts-text apexcharts-datalabel-value" style="font-family: inherit;">F</text></g></g></g></g><line id="SvgjsLine9646" x1="0" y1="0" x2="190" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" stroke-linecap="butt" class="apexcharts-ycrosshairs"></line><line id="SvgjsLine9647" x1="0" y1="0" x2="190" y2="0" stroke-dasharray="0" stroke-width="0" stroke-linecap="butt" class="apexcharts-ycrosshairs-hidden"></line></g></svg></div></div>
    </div>

                            </div>
                        </div>
                        <div class="col-md-9 col-12 col-pdf-9">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h3 class="font-600 social-score-message ms-0 ms-xl-n4">Your social needs improvement</h3>
                                    <div class="social-score-description ms-0 ms-xl-n4">You appear to have a weak social presence or level of social activity (or we may just not be able to see your profiles!). Social activity is important for customer communication, brand awareness and as a marketing channel to bring visitors to your website. We recommend that you list all of your profiles on your page for visibility, and begin to build a following on those networks.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="portlet-body card-body pt-0">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                    
    
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasFacebook tr-always-border">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Facebook Page Linked</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        </div><div class="faq-box row-hidden field-hasFacebook tr-always-border expandable" id="hasFacebook62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Facebook Page Linked</h5>
                            <div class="answer field-value">No associated Facebook Page found as a link on your page.</div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        <div class="check-info" style="display: none"><p class="what">Creating Social Profiles as well as linking to these from your website can help to build trust in your business and provide other mediums to nurture your customer relationships.</p><p class="how">We recommend creating all common Social Profiles and linking to these from your website. Most CMS systems will offer fields to enter your Social Profile URLs and will display these in a button row section in the footer.</p><p class="more-info"><a href="/blog/social-media-links/" target="_blank">Learn more in our guide</a></p></div></div>
    </div>
        
    
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasOpenGraphTags avoid-break-inside">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Facebook Open Graph Tags</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field-details"></div>   
            </div>             
        </div><div class="faq-box row-hidden field-hasOpenGraphTags avoid-break-inside expandable" id="hasOpenGraphTags62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Facebook Open Graph Tags</h5>
                            <div class="answer field-value">Your page is using Facebook Open Graph Tags.</div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field-details"><div class="js-collapse-parent">
   <a class="btn btn-light btn-sm js-collapse-in">Show Details</a>
   <div class="js-collapse-target collapse">
       <div class="answer headers field-value-table">        <div class="table-responsive table-part"><table class="table table-row-dashed table-fluid">            <thead>                <tr><th class="min-w-sm-150px">Tag</th>                <th>Content</th>            </tr></thead>            <tbody><tr><td>og:title</td><td>AI LinkedIn Automation Extension for Growth &amp; Leads | Kommentify</td></tr><tr><td>og:description</td><td>Kommentify is an AI-powered LinkedIn automation extension for smart commenting, intelligent networking, and lead tracking—all in a safe, browser-based solution.</td></tr><tr><td>og:url</td><td>https://kommentify.com</td></tr><tr><td>og:site_name</td><td>Kommentify</td></tr><tr><td>og:locale</td><td>en_US</td></tr><tr><td>og:image</td><td>https://kommentify.com/og-image.png</td></tr><tr><td>og:image:width</td><td>1200</td></tr><tr><td>og:image:height</td><td>630</td></tr><tr><td>og:image:alt</td><td>Kommentify - LinkedIn Automation</td></tr><tr><td>og:type</td><td>website</td></tr></tbody></table></div></div>
       <a class="btn btn-light btn-sm js-collapse-out mt-3">Hide Details</a>
   </div>
</div></div>   
            </div>             
        <div class="check-info" style="display: none"><p class="what">Facebook Open Graph Tags are a type of structured data that can be placed on your page to control what is shown when your page is shared on Facebook. You can indicate exactly what content should appear in a sharing snippet's title, description, imagery and other information.  This is useful when pages like your homepage, products or articles are shared, and effective sharing can drive traffic and conversions. You may want to ensure that the content presented is correct and has the highest chance of attracting visitors. If you don't define specific content, Facebook may decide automatically which pieces of text and imagery are displayed which may not always be correct or appealing.</p><p class="how">We recommend defining as many of Facebook's Open Graph fields as possible, and inserting this code into the HTML of your page. Facebook has a helper tool for creating this content, or sometimes it can be written automatically with the help of a CMS plugin.</p></div></div>
    </div>
        
    
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasFacebookPixel avoid-break-inside">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Facebook Pixel</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        </div><div class="faq-box row-hidden field-hasFacebookPixel avoid-break-inside expandable" id="hasFacebookPixel62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Facebook Pixel</h5>
                            <div class="answer field-value">Your page has a Facebook Pixel installed.        <br><table class="table table-row-dashed table-fluid mb-0 mt-3" style="width:50%;">            <thead><tr>                <th>Pixel ID</th>            </tr></thead>            <tbody>            <tr>                <td>1325317928900506</td>            </tr></tbody></table></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        <div class="check-info" style="display: none"><p class="what">Facebook Pixel is a piece of analytics code that allows Facebook to capture and analyse visitor information from your site. This allows you to retarget these visitors with Facebook messaging in future, or build new 'lookalike' audiences similar to your existing visitors. </p><p class="how">In can be a good idea to install a Facebook Pixel if you intend to do any Facebook related marketing in the future in order to prepare audience data.</p></div></div>
    </div>
        
    
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasTwitter tr-always-border">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">X (formerly Twitter) Account Linked</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        </div><div class="faq-box row-hidden field-hasTwitter tr-always-border" id="hasTwitter62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">X (formerly Twitter) Account Linked</h5>
                            <div class="answer field-value">No associated X Profile found as a link on your page.</div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        <div class="check-info" style="display: none"></div></div>
    </div>
        
    
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasTwitterTags avoid-break-inside">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">X Cards</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field-details"></div>   
            </div>             
        </div><div class="faq-box row-hidden field-hasTwitterTags avoid-break-inside expandable" id="hasTwitterTags62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">X Cards</h5>
                            <div class="answer field-value">Your page is using X Cards.</div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x text-success ki-check mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field-details"><div class="js-collapse-parent">
   <a class="btn btn-light btn-sm js-collapse-in">Show Details</a>
   <div class="js-collapse-target collapse">
       <div class="answer headers field-value-table">        <div class="table-responsive table-part"><table class="table table-row-dashed table-fluid">            <thead>                <tr><th class="min-w-sm-150px">Tag</th>                <th>Content</th>            </tr></thead>            <tbody><tr><td>twitter:card</td><td>summary_large_image</td></tr><tr><td>twitter:creator</td><td>@kommentify</td></tr><tr><td>twitter:title</td><td>AI LinkedIn Automation Extension for Growth &amp; Leads | Kommentify</td></tr><tr><td>twitter:description</td><td>Kommentify is an AI-powered LinkedIn automation extension for smart commenting, intelligent networking, and lead tracking.</td></tr><tr><td>twitter:image</td><td>https://kommentify.com/og-image.png</td></tr></tbody></table></div></div>
       <a class="btn btn-light btn-sm js-collapse-out mt-3">Hide Details</a>
   </div>
</div></div>   
            </div>             
        <div class="check-info" style="display: none"><p class="what">Similar to Facebook Open Graph Tags, X Cards are a type of structured data that can be placed on your page to control what is shown when your page is shared on X. You can indicate exactly what content should appear in a sharing snippet's title, description, imagery and other information.</p><p class="how">We recommend defining as many of X`s Cards as possible, and inserting this code into the HTML of your page. X has a cards markup tool for creating this content, or sometimes it can be written automatically with the help of a CMS plugin.</p></div></div>
    </div>
        
    
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasInstagram tr-always-border">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Instagram Linked</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        </div><div class="faq-box row-hidden field-hasInstagram tr-always-border" id="hasInstagram62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Instagram Linked</h5>
                            <div class="answer field-value">No associated Instagram Profile found linked on your page</div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        <div class="check-info" style="display: none"></div></div>
    </div>
        
    
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasLinkedIn avoid-break-inside tr-always-border">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">LinkedIn Page Linked</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        </div><div class="faq-box row-hidden field-hasLinkedIn avoid-break-inside tr-always-border" id="hasLinkedIn62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">LinkedIn Page Linked</h5>
                            <div class="answer field-value">No associated LinkedIn Profile found linked on your page.</div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        <div class="check-info" style="display: none"></div></div>
    </div>
        
    
    <div class="row-hidden check-group">
        <div class="faq-box row-hidden field-socialActivity avoid-break-inside">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Social Shares</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        </div><div class="faq-box row-hidden field-socialActivity avoid-break-inside" id="socialActivity62508487">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 ">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">Social Shares</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px ">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        <div class="check-info" style="display: none"></div></div>
    </div>
        <div class="row avoid-break-inside"><div class="col-md-6">
    
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-hasYoutube tr-always-border">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 col-md-10">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">YouTube Channel Linked</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px col-md-2">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        </div><div class="faq-box row-hidden field-hasYoutube tr-always-border" id="hasYoutube62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 col-md-10">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">YouTube Channel Linked</h5>
                            <div class="answer field-value">No associated YouTube Channel found linked on your page.</div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px col-md-2">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        <div class="check-info" style="display: none"></div></div>
    </div>
        
    </div><div class="col-md-6">
    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-youtubeActivity">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 col-md-10">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">YouTube Channel Activity</h5>
                            <div class="answer field-value"></div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px col-md-2">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        </div><div class="faq-box row-hidden field-youtubeActivity" id="youtubeActivity62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11 col-md-10">
                        <div class="avoid-break-inside">
                            <h5 class="question" data-wow-delay=".1s">YouTube Channel Activity</h5>
                            <div class="answer field-value">No associated YouTube Channel found linked on your page.</div> 
                        </div>
                    </div>
                    <div class="col-1 p-0 mh-5px col-md-2">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                                <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>                            
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                   
            </div>             
        <div class="check-info" style="display: none"></div></div>
    </div>
    </div></div>
                            </div>
                        </div>
                    </div>
                </div>
                                    <div class="badge badge-primary p-6 py-5 fs-6 rounded-top-0 rounded-bottom-2 d-flex flex-wrap align-items-center" style="line-height:25px;">
                        Want to grow your YouTube Channel? Try our &nbsp;
                        <a class="text-white text-decoration-underline d-flex flex-wrap align-items-center" target="_blank" href="https://tuberanker.com/">YouTube SEO Tool                            <i class="h-25px d-inline-block ms-2 mb-1" style="background: url(/img/tagsyoutube-logo-blue.svg) no-repeat center center; background-size: contain; width: 130px"></i>
                        </a>
                            </div>
        </div>
    </div>
</div>

                        <div class="container-check block tab-localseo" style="">
    <div class="row g-5 gx-xl-10 mb-5 mb-xl-10" id="localseo">
        <div class="col-xxl-12 position-relative">
            <div class="portlet card card-flush">
                <div class="portlet-heading js-header-container avoid-break-after card-header pt-7">
                    <h2 class="section-title align-items-start">
                        <span class="fw-bold">
                            Local SEO                        </span>
                    </h2>
                </div>
                <div class="portlet-body card-body pt-6 pb-6">
                    <div class="row">
                        <div class="col-xxl-12">
                            <div>
                                                                <div class="row-hidden check-group" style="display: block;">
                                    <div class="faq-box row-hidden tr-always-border field-googleMapsWebsiteData">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Address &amp; Phone Shown on Website</h5>
                                                    <div class="answer field-value"></div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    </div><div class="faq-box row-hidden tr-always-border field-googleMapsWebsiteData expandable" id="googleMapsWebsiteData62508487" style="display: block;">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Address &amp; Phone Shown on Website</h5>
                                                    <div class="answer field-value">We can't identify one or both of these components on the page. Missing: Phone, Address</div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x ki-cross text-danger mt-n4">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    <div class="check-info" style="display: none"><p class="what">Address &amp; phone number are key pieces of information for customers to contact a local business. However they also help Google identify that the website represents a particular local business to build a complete online profile helping it rank in local search results.</p><p class="how">Ensure that your full business address and phone number are correct and clearly visible in clear text on the site and not hidden behind expanders or text that could load dynamically.</p></div></div>
                                </div>
                                                                <div class="row-hidden check-group" style="display: block;">
                                    <div class="faq-box row-hidden tr-always-border field-localBusinessSchema">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Local Business Schema</h5>
                                                    <div class="answer field-value"></div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    </div><div class="faq-box row-hidden tr-always-border field-localBusinessSchema expandable" id="localBusinessSchema62508487" style="display: block;">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Local Business Schema</h5>
                                                    <div class="answer field-value">No Local Business Schema identified on the page.</div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x ki-cross text-danger mt-n4">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    <div class="check-info" style="display: none"><p class="what">Local Business Schema is a type of structured data markup that can be added to the code of a webpage. Adding accurate Local Business Schema categories helps Search Engines more understand your website and the business it represents so that it can rank in local search results.</p><p class="how">The approach for adding Local Business Schema depends on your website's capabilities. Your CMS may have the ability to input this directly, or you may need to install a Schema app or plugin. Alternatively you can manually create your Schema through the use of an online Schema Generator tool and copy this into the code of your site.</p></div></div>
                                </div>
                                                                <div class="row-hidden check-group" style="display: block;">
                                    <div class="faq-box row-hidden tr-always-border field-googleMapsProfileExists">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Google Business Profile Identified</h5>
                                                    <div class="answer field-value"></div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    </div><div class="faq-box row-hidden tr-always-border field-googleMapsProfileExists expandable" id="googleMapsProfileExists62508487" style="display: block;">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Google Business Profile Identified</h5>
                                                    <div class="answer field-value">You can see information about your page's Google Business Profile within this report by signing up to one of our premium plans.<div class="append2"><a class="btn btn-primary btn-sm btn-report-signup" href="/register" target="_blank">Signup - Free Trial</a></div></div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x bi bi-info mt-n4">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    <div class="check-info" style="display: none"><p class="what">A Google Business Profile (GBP) is a listing representing your business that appears in Google Maps or standard Google Searches that have local intent. GBP contains key information about the business such as name, location, contact information, opening hours as well as customer ratings and reviews. GBP is an important tool for local businesses to manage their online presence, reach customers on Google, and compete against other similar businesses.</p><p class="how">If you are a local business, it is important to create your Google Business Profile (or claim it if one has been automatically created by Google) and update the details as completely and accurately as possible. We try to identify your GBP based on the website URL listed in the profile matching the one in this audit. If your GBP profile exists but we can't identify it, you may want to check that the website URL is correct.</p></div></div>
                                </div>
                                                                <div class="row-hidden check-group">
                                    <div class="faq-box row-hidden tr-always-border field-googleMapsProfileCompleteness">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Google Business Profile Completeness</h5>
                                                    <div class="answer field-value"></div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    </div><div class="faq-box row-hidden tr-always-border field-googleMapsProfileCompleteness" id="googleMapsProfileCompleteness62508487">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Google Business Profile Completeness</h5>
                                                    <div class="answer field-value"></div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    <div class="check-info" style="display: none"></div></div>
                                </div>
                                                                <div class="row-hidden check-group">
                                    <div class="faq-box row-hidden tr-always-border field-googleMapsReviews">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Google Reviews</h5>
                                                    <div class="answer field-value"></div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    </div><div class="faq-box row-hidden tr-always-border field-googleMapsReviews" id="googleMapsReviews62508487">
                                        <div class="avoid-break-inside">
                                            <div class="js-header-place"></div>
                                            <div class="row">
                                                <div class="col-11">
                                                    <h5 class="question">Google Reviews</h5>
                                                    <div class="answer field-value"></div>
                                                </div>
                                                <div class="col-1 p-0 mh-45px">
                                                    <div class="widget-bg-color-icon">
                                                        <div class="bg-icon pull-left">
                                                            <i class="md ki-duotone fs-4x">
                                                                <span class="path1"></span>
                                                                <span class="path2"></span>
                                                                <span class="path3"></span>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="answer field-value-table"></div>
                                        </div>
                                    <div class="check-info" style="display: none"></div></div>
                                </div>
                                                            </div>
                        </div>
                    </div>
                </div>
                                <div class="badge badge-primary px-6 py-5 fs-6 rounded-top-0 rounded-bottom-2 d-flex flex-wrap align-items-center" style="line-height: 25px;">
                    Want to improve your Local Search Presence? Try our &nbsp;
                    <a class="text-white text-decoration-underline d-flex flex-wrap align-items-center" target="_blank" href="https://localranking.com/">Local SEO Tool                        <i class="h-25px d-inline-block ms-2 mb-1" style="background: url(/img/LogoWhite400.png) no-repeat center center; background-size: contain; width: 130px"></i>
                    </a>
                </div>
                            </div>
        </div>
    </div>
</div>

                        <div class="container-check block tab-technology" style="">
    <div class="row g-5 gx-xl-10 mb-5 mb-xl-10" id="technology">
        <div class="col-xxl-12 position-relative">
            <div class="portlet card card-flush">
                <div class="avoid-break-before">
                    <div class="portlet-heading  card-header pt-7 js-header-container avoid-break-after border-bottom-0">
                        <h2 class="section-title align-items-start">
                            <span class="fw-bold">
                                Technology Results                            </span>
                        </h2>
                    </div>
                    <div class="portlet-body card-body pt-6 pb-6">
                        <!-- technology list -->
                        <div>
                                <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-technologies">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Technology List</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
            <div class="field-details"></div> 
        </div><div class="faq-box row-hidden field-technologies" id="technologies62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Technology List</h5>
                        <div class="answer field-value">These software or coding libraries have been identified on your page.</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
            <div class="field-details"><div class="avoid-break-before table-part" style="width:66%;"><table class="table table-row-dashed table-fixed"><thead><tr><th style="width:8%; min-width: 24px;"></th><th>Technology</th><th style="width:25%;">Version</th></tr></thead><tbody><tr><td class="text-left" style="width:8%;"><a href="http://facebook.com" target="_blank"><img class="technologies-img" src="/img/icons/app/Facebook.svg" onerror="this.style.display='none'"></a></td><td style="vertical-align: middle;">Facebook Pixel</td><td style="vertical-align: middle; width:25%;" class="text-center;"></td></tr><tr><td class="text-left" style="width:8%;"><a href="https://vercel.com" target="_blank"><img class="technologies-img" src="/img/icons/app/vercel.svg" onerror="this.style.display='none'"></a></td><td style="vertical-align: middle;">Vercel</td><td style="vertical-align: middle; width:25%;" class="text-center;"></td></tr><tr><td class="text-left" style="width:8%;"><a href="https://vercel.com/analytics" target="_blank"><img class="technologies-img" src="/img/icons/app/vercel.svg" onerror="this.style.display='none'"></a></td><td style="vertical-align: middle;">Vercel Analytics</td><td style="vertical-align: middle; width:25%;" class="text-center;"></td></tr></tbody></table></div></div> 
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-ip">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Server IP Address</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        </div><div class="faq-box row-hidden field-ip" id="ip62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Server IP Address</h5>
                        <div class="answer field-value">216.198.79.1</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-dns">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">DNS Servers</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        </div><div class="faq-box row-hidden field-dns" id="dns62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">DNS Servers</h5>
                        <div class="answer field-value">dns1.registrar-servers.com<br>dns2.registrar-servers.com<br></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-webServer">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Web Server</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        </div><div class="faq-box row-hidden field-webServer" id="webServer62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Web Server</h5>
                        <div class="answer field-value">Vercel</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-charset">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Charset</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        </div><div class="faq-box row-hidden field-charset" id="charset62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">Charset</h5>
                        <div class="answer field-value">text/html; charset=utf-8</div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x bi bi-info mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        <div class="check-info" style="display: none"></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-dmarc tr-always-border">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">DMARC Record</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        </div><div class="faq-box row-hidden field-dmarc tr-always-border expandable" id="dmarc62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">DMARC Record</h5>
                        <div class="answer field-value">This  site does not appear to have a DMARC record in place.<div class="append2">DMARC records are important to improve email deliverability and combat spoofing.</div></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        <div class="check-info" style="display: none"><p class="what">DMARC (Domain-based Message Authentication, Reporting, and Conformance) is a DNS record that can be added for a site to help prevent email spoofing from malicious parties. It is more frequently being adopted as a mailing requirement by email providers like Google and can affect deliverability rates if not in place.</p><p class="how">We recommend reviewing the documentation from both your email delivery platform as well as common recipient platforms like Gmail and Outlook to determine the appropriate DMARC records and how to implement this into your site's DNS</p></div></div>
    </div>    <div class="row-hidden check-group" style="display: block;">
        <div class="faq-box row-hidden field-spf tr-always-border">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">SPF Record</h5>
                        <div class="answer field-value"></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        </div><div class="faq-box row-hidden field-spf tr-always-border expandable" id="spf62508487" style="display: block;">
            <div class="avoid-break-inside">
                <div class="js-header-place"></div> 
                <div class="row">
                    <div class="col-11">
                        <h5 class="question" data-wow-delay=".1s">SPF Record</h5>
                        <div class="answer field-value">This site does not appear to have an SPF record.<div class="append2">SPF records are important to improve email deliverability and combat spoofing.</div></div>
                    </div>
                    <div class="col-1 p-0 mh-45px">
                        <div class="widget-bg-color-icon">
                            <div class="bg-icon bg-icon-inverse pull-left">
                            <i class="ki-duotone fs-4x ki-cross text-danger mt-n4">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>                            
                            </i>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
             
        <div class="check-info" style="display: none"><p class="what">An SPF (Sender Policy Framework) record is a DNS record that is set to identify mail servers and domains that are allowed to send email on behalf of your domain and is designed to help combat email spoofing.</p><p class="how">We recommend reviewing the documentation of all the delivery platforms you use to determine the appropriate SPF records to implement for your site to ensure highest deliverability.</p></div></div>
    </div>                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

                        <div class="container-check block tab-subpages" style="">
    <div class="row g-5 gx-xl-10 mb-5 mb-xl-10" id="subpages">
        <div class="col-xxl-12 position-relative">
            <div class="portlet card card-flush">
                <div class="portlet-heading js-header-container avoid-break-inside card-header pt-7 pb-0">
                    <h2 class="section-title align-items-start flex-column">
                        <span class="fw-bold hidden-pdf">
                            Review Child Pages                         </span>
                        <span class="fw-bold hidden-web">
                            Child Pages                         </span>
                    </h2>
                </div>
                <div class="portlet-body card-body pt-2">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <div class="row-hidden check-group" style="display: block;">
                                    <div class="faq-box row-hidden field-subpages">
                                        <div class="field-value"></div>
                                    </div><div class="faq-box row-hidden field-subpages" id="subpages62508487" style="display: block;">
                                        <table class="table table-row-dashed table-fluid mb-0">                <thead>                    <tr><th width="100%">Page</th></tr>                </thead>                <tbody><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/about">/about</a></td></tr><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/contact">/contact</a></td></tr><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/features">/features</a></td></tr><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/lifetime-deal">/lifetime-deal</a></td></tr><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/login">/login</a></td></tr><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/privacy-policy">/privacy-policy</a></td></tr><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/referral">/referral</a></td></tr><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/refund-policy">/refund-policy</a></td></tr><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/signup">/signup</a></td></tr><tr><td><a class="no-link-pdf" href="https://www.seoptimer.com/kommentify.com/terms">/terms</a></td></tr></tbody></table><div class="field-value"></div>
                                    <div class="check-info" style="display: none"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

                        <div class="row g-5 gx-xl-10 mb-5 mb-xl-10 active">
    <div class="col-xxl-12">
        <div class="guest-banner card card-flush bg-primary text-white overflow-hidden p-10 m-0 portlet">
            <div class="guest-banner-container d-flex align-items-center align-items-lg-stretch justify-content-center flex-column flex-lg-row min-h-180px">
                <div class="guest-banner-image-container d-flex pe-lg-6 justify-content-center align-items-start position-relative d-lg-none w-100 w-md-75 w-lg-50">
                    <img class="position-lg-absolute mx-auto" style="width: 68%; bottom: -37px;" src="/img/embeddable-audit-tool/tablet_en.png">
                </div>
                <div class="guest-banner-text-container ps-lg-4 w-100 position-relative w-lg-50 mt-6 mt-lg-0">
                    <h2 class="fw-semibold text-white mb-7">Embed an Audit Tool into your Agency's Site</h2>
                    <p class="fs-5">Match your website's styling and colors. Show your customer a beautiful branded report. Get notified of leads straight to your Inbox.</p>                                            <div class="btn btn-sm btn-success result_banner-btn">
                            <a class="text-white" target="_blank" href="/embeddable-audit-tool/">Learn More - Embedding</a>
                        </div>
                                        <div class="guest-banner-logo min-w-210 position-absolute end-0 bottom-0 me-n2 mb-n6 d-none d-lg-block">
                        <img src="/img/logo_site_white.png">
                    </div>
                </div>
                                    <div class="guest-banner-image-container d-none d-lg-flex ps-lg-6 justify-content-center align-items-start mt-lg-10 w-100 w-md-75 w-lg-50 position-relative min-h-180px">
                        <img class="position-lg-absolute mx-auto" style="width: 68%; bottom: -37px;" src="/img/embeddable-audit-tool/tablet_en.png">
                    </div>
                            </div>
        </div>
    </div>
</div>

                    </div>
                <!--end::Content container-->
            </div>
            <!--end::Content-->
        </div>
        <!--end::Content wrapper-->
    </div>
    <!--end::Main-->
</div>

<div class="popover bs-popover-bottom js-subpages-popover position-absolute" role="tooltip" style="display: none;">
	<div class="popover-arrow position-absolute" style="left: 50%;"></div>
	<div class="popover-body" align="center">
		<p>Sign up to our Premium Plans to Audit Child Pages. 14 Day Free Trial</p>
		<p class="mb-0"><a class="btn btn-primary btn-sm" target="_blank" href="/register">Signup Now</a></p>
	</div>
</div>


<div class="modal fade" id="options-modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered mw-500px" role="document">
        <div class="modal-content">
            <div class="modal-header">
                    <h2 class="modal-title">Report Options</h2>
                    <div class="btn btn-sm btn-icon btn-active-color-primary" data-bs-dismiss="modal" aria-label="Close">
                        <i class="ki-duotone ki-cross fs-1"><span class="path1"></span><span class="path2"></span></i>
                    </div>
                </div>
            <form class="form">
                <div class="modal-body">
                                        <input id="options-domain" type="hidden" value="kommentify.com">
                    <input id="options-audit-domain" type="hidden" value="">
                    <input id="options-host-domain" type="hidden" value="seoptimer.com">
                    <input id="options-sub-domain" type="hidden" value="">
                    <input id="options-language" type="hidden" value="">

                    <div class="d-flex flex-column mb-5 fv-row">
                        <label class="form-label mb-2">
                            Template                            <span class="ms-1" data-bs-toggle="tooltip" data-bs-html="true" data-bs-custom-class="custom-tooltip" data-bs-title="&lt;p&gt;Report Templates allow you to choose the specific set of branding or report settings that you would like to apply to this White Label Report.&lt;/p&gt;
                                                    &lt;p&gt;You can modify the settings of your Default template from the Report Templates page or create additional templates with different settings.&lt;/p&gt;
                                                    &lt;p&gt;This feature is useful if your business has multiple brands, operates in multiple languages, or if you want reports that exclusively cover certain types of checks.&lt;/p
                            " data-kt-initialized="1">
                                <i class="ki-duotone ki-information-5 text-gray-500 fs-6">
                                    <span class="path1"></span><span class="path2"></span><span class="path3"></span>
                                </i>
                            </span>
                        </label>
                        <select id="options-template" class="form-select select2-hidden-accessible" name="template_id" data-control="select2" data-hide-search="true" data-select2-id="select2-data-options-template" tabindex="-1" aria-hidden="true" data-kt-initialized="1">
<option value="none" selected="" data-select2-id="select2-data-2-v125">No Template</option>
<option value="default">Default Template</option>
</select><span class="select2 select2-container select2-container--bootstrap5" dir="ltr" data-select2-id="select2-data-1-cz1b" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single form-select" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-options-template-container" aria-controls="select2-options-template-container"><span class="select2-selection__rendered" id="select2-options-template-container" role="textbox" aria-readonly="true" title="No Template">No Template</span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>                    </div>

                    <div class="mb-5 fv-row">
                        <label class="form-label mb-2">
                            Target Keyword                            <span class="ms-1" data-bs-toggle="tooltip" data-bs-html="true" data-bs-custom-class="custom-tooltip" data-bs-original-title="&lt;p&gt;Generally the goal of SEO is to optimize particular webpages to rank for specific search terms keywords.&lt;/p&gt;
                                                    &lt;p&gt;In order to help achieve that, it is important to optimize the important on-page fields of a web page to include this keyword.&lt;/p&gt;
                                                    &lt;p&gt;Adding a Target Keyword to your report will add several 'Target Keyword' checks to your report that evaluate whether this keyword is being used in important areas such as Title, Meta Description, H1 and URLs.&lt;/p&gt;
                                                    &lt;p&gt;Note, as new checks are being added when this feature is used, the scoring of the report may change slightly vs a report without a Target Keyword having been added.&lt;/p
                            " data-kt-initialized="1">
                                <i class="ki-duotone ki-information-5 text-gray-500 fs-6">
                                    <span class="path1"></span><span class="path2"></span><span class="path3"></span>
                                </i>
                            </span>
                        </label>
                        <input type="text" id="options-target" class="form-control" name="target" value="" maxlength="100">                    </div>
                    <div class="mb-5 fv-row">
                        <label class="form-label mb-2">
                            Competitor 1                            <span class="ms-1" data-bs-toggle="tooltip" data-bs-html="true" data-bs-custom-class="custom-tooltip" data-bs-original-title="&lt;p&gt;Adding competitors to your report allows you to evaluate the performance of competing websites side-by-side with the primary site.&lt;/p&gt;
                                    &lt;p&gt;Where possible, competitor data is truncated and made smaller to avoid diverting attention from the primary website.&lt;/p&gt;
                                    &lt;p&gt;Note, the runtime of these reports will take longer, as more content needs to be evaluated.&lt;/p&gt;
                                " data-kt-initialized="1">
                                <i class="ki-duotone ki-information-5 text-gray-500 fs-6">
                                    <span class="path1"></span><span class="path2"></span><span class="path3"></span>
                                </i>
                            </span>
                        </label>
                        <input type="text" id="options-competitor1" class="form-control" name="competitor1" value="" maxlength="100">                    </div>
                    <div class="mb-5 fv-row">
                        <label class="form-label mb-2">
                            Competitor 2                        </label>
                        <input type="text" id="options-competitor2" class="form-control" name="competitor2" value="" maxlength="100">                    </div>
                </div>
                <div class="modal-footer flex-end pt-0 border-top-0">
                    <button type="button" class="btn btn-secondary btn-light me-3" data-bs-dismiss="modal">
                    Cancel                    </button>
                    <button type="button" id="options-save" class="btn btn-primary btn-submit">
                        Save                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

        <script src="/js/jquery.min.js?v=1624086491"></script>
<script src="/assets/translate/en-US.js?v=1620270143"></script>
<script src="/js/md5.js?v=1578124534"></script>
<script src="/js/lajax.js?v=1624086491"></script>
<script src="/assets/492ae612/plugins/custom/apexcharts/apexcharts.bundle.js?v=1752304645"></script>
<script src="/assets/492ae612/plugins/custom/rgraph-meter/rgraph-meter.bundle.js?v=1752304645"></script>
<script src="/assets/4da1e2ff/js/common.js?v=1764863212"></script>
<script src="/assets/4da1e2ff/js/audit.js?v=1752304645"></script>
<script src="/assets/4da1e2ff/js/report.js?v=1762618935"></script>
<script src="/assets/492ae612/plugins/custom/fslightbox/fslightbox.bundle.js?v=1752304645"></script>
<script src="/assets/492ae612/js/scripts.bundle.js?v=1752304645"></script>
<script src="/assets/492ae612/plugins/global/plugins.bundle.js?v=1752304645"></script>
<script src="/assets/492ae612/plugins/custom/datatables/datatables.bundle.js?v=1752304645"></script>
<script src="https://cdn.datatables.net/fixedcolumns/4.3.0/js/dataTables.fixedColumns.min.js"></script>
<script src="https://cdn.datatables.net/fixedcolumns/4.3.0/js/fixedColumns.dataTables.min.js"></script>
<script src="/assets/4da1e2ff/js/analytics.js?v=1752304645"></script>    </div>
</div>
<script>
    window.intercomSettings = {
        api_base: "https://api-iam.intercom.io",
                                language: 'en-US',         app_id: "nxc2nhce"
    };
</script>

<script>
    // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/xxxxxx'
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/nxc2nhce';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
</script>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PKFF6QB" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-79504822-1', 'auto');
        ga('send', 'pageview');
    </script>

<!-- hotjar analytics is not enabled -->
<!-- Matomo -->
<script>
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
        var u="//mat.seoptimer.com/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '1']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
    })();
</script>
<!-- End Matomo Code -->

<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9bc6f7abfc6df9ef',t:'MTc2ODE2MTI4MQ=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script>

</div><iframe height="1" width="1" style="position: absolute; top: 0px; left: 0px; border: none; visibility: hidden;"></iframe><div id="give-freely-root-kkkbiiikppgjdiebcabomlbidfodipjg" class="give-freely-root" data-extension-id="kkkbiiikppgjdiebcabomlbidfodipjg" data-extension-name="Substital: Add subtitles to videos and movies" style="display: block;"><template shadowrootmode="open"><style>
  :host {
    all: initial;
  }

  .gf-scroll-remove::-webkit-scrollbar {
    border-radius-bottom-right: 15px;
  }

  button {
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  button:active {
    transform: scale(0.98);
  }

  .give-freely-close-button:hover {
    opacity: 0.7;
  }

  input[type="radio"] {
    margin-right: 8px;
  }

  hr {
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 1em 0;
  }

  @media (max-width: 600px), (max-height: 480px) {
    #give-freely-checkout-popup {
      display: none !important;
    }
  }

  dialog::backdrop  {
    background-color: rgba(180, 180, 180, 0.8);
  }

  dialog.backdrop-hidden::backdrop  {
    background-color: transparent;
  }
</style><div><div class="gf-app"></div></div></template></div><div class="js-clipboard-popup dt-button-info" style="display:none; opacity:0"><div class="js-clipboard-popup-message"></div></div><svg id="SvgjsSvg1046" width="2" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev" style="overflow: hidden; top: -100%; left: -100%; position: absolute; opacity: 0;"><defs id="SvgjsDefs1047"></defs><polyline id="SvgjsPolyline1048" points="0,0"></polyline><path id="SvgjsPath1049" d="M0 0 "></path></svg><div id="css-checker-widget"><template shadowrootmode="open"><style type="text/css">/*! tailwindcss v4.1.8 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-leading:initial;--tw-font-weight:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-duration:initial;--tw-ease:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-600:oklch(57.7% .245 27.325);--color-yellow-600:oklch(68.1% .162 75.834);--color-blue-600:oklch(54.6% .245 262.881);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-300:oklch(87.2% .01 258.338);--color-black:#000;--color-white:#fff;--spacing:.25rem;--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--ease-in-out:cubic-bezier(.4,0,.2,1);--animate-spin:spin 1s linear infinite;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::file-selector-button{-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.bottom-8{bottom:calc(var(--spacing)*8)}.left-1\/2{left:50%}.z-50{z-index:50}.z-\[9999\]{z-index:9999}.col-span-8{grid-column:span 8/span 8}.col-span-12{grid-column:span 12/span 12}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.block{display:block}.flex{display:flex}.grid{display:grid}.hidden{display:none}.h-1\.5{height:calc(var(--spacing)*1.5)}.h-10{height:calc(var(--spacing)*10)}.h-\[18\.6px\]{height:18.6px}.h-\[18px\]{height:18px}.h-\[23px\]{height:23px}.h-\[24px\]{height:24px}.h-\[25px\]{height:25px}.h-\[26px\]{height:26px}.h-\[30px\]{height:30px}.h-\[31px\]{height:31px}.h-\[42px\]{height:42px}.h-\[56px\]{height:56px}.h-\[127px\]{height:127px}.h-\[160px\]{height:160px}.h-\[178px\]{height:178px}.h-full{height:100%}.max-h-\[min\(750px\,100vh\)\]{max-height:min(750px,100vh)}.w-6{width:calc(var(--spacing)*6)}.w-10{width:calc(var(--spacing)*10)}.w-\[18\.6px\]{width:18.6px}.w-\[18px\]{width:18px}.w-\[24px\]{width:24px}.w-\[31px\]{width:31px}.w-full{width:100%}.min-w-\[23px\]{min-width:23px}.min-w-\[25px\]{min-width:25px}.min-w-\[30px\]{min-width:30px}.min-w-\[118px\]{min-width:118px}.min-w-\[178px\]{min-width:178px}.min-w-\[224px\]{min-width:224px}.min-w-\[232px\]{min-width:232px}.flex-1{flex:1}.flex-none{flex:none}.flex-grow{flex-grow:1}.border-collapse{border-collapse:collapse}.-translate-x-1\/2{--tw-translate-x: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-0{--tw-translate-y:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-5{--tw-translate-y:calc(var(--spacing)*5);translate:var(--tw-translate-x)var(--tw-translate-y)}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.animate-spin{animation:var(--animate-spin)}.cursor-grab{cursor:grab}.cursor-nwse-resize{cursor:nwse-resize}.cursor-pointer{cursor:pointer}.resize{resize:both}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-20{grid-template-columns:repeat(20,minmax(0,1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-items-center{justify-items:center}.justify-items-start{justify-items:start}.gap-\[0px\]{gap:0}.gap-\[5px\]{gap:5px}.gap-\[10px\]{gap:10px}.gap-\[11px\]{gap:11px}.gap-\[15px\]{gap:15px}.gap-x-\[11px\]{column-gap:11px}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.overscroll-contain{overscroll-behavior:contain}.rounded-\[3px\]{border-radius:3px}.rounded-\[7px\]{border-radius:7px}.rounded-\[13px\]{border-radius:13px}.rounded-\[15px\]{border-radius:15px}.rounded-full{border-radius:3.40282e38px}.rounded-tl-\[7px\]{border-top-left-radius:7px}.rounded-tr-\[7px\]{border-top-right-radius:7px}.rounded-br-\[7px\]{border-bottom-right-radius:7px}.rounded-bl-\[7px\]{border-bottom-left-radius:7px}.border{border-style:var(--tw-border-style);border-width:1px}.border-4{border-style:var(--tw-border-style);border-width:4px}.border-\[0\.5px\]{border-style:var(--tw-border-style);border-width:.5px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-solid{--tw-border-style:solid;border-style:solid}.border-black{border-color:var(--color-black)}.border-gray-300{border-color:var(--color-gray-300)}.border-t-blue-600{border-top-color:var(--color-blue-600)}.bg-\[\#000000\]{background-color:#000}.bg-\[\#007aff\]{background-color:#007aff}.bg-\[\#F3F3F3\]{background-color:#f3f3f3}.bg-\[\#F9F9F9\]{background-color:#f9f9f9}.bg-\[\#eee\]{background-color:#eee}.bg-gray-100{background-color:var(--color-gray-100)}.bg-white{background-color:var(--color-white)}.p-0{padding:calc(var(--spacing)*0)}.p-2{padding:calc(var(--spacing)*2)}.p-2\.5{padding:calc(var(--spacing)*2.5)}.p-\[2px\]{padding:2px}.p-\[12px\]{padding:12px}.px-\[16px\]{padding-inline:16px}.pt-2{padding-top:calc(var(--spacing)*2)}.pt-\[8px\]{padding-top:8px}.pt-\[10px\]{padding-top:10px}.pt-\[12px\]{padding-top:12px}.pt-\[20px\]{padding-top:20px}.pt-\[26px\]{padding-top:26px}.pr-\[6px\]{padding-right:6px}.pr-\[9px\]{padding-right:9px}.pb-\[7\.28px\]{padding-bottom:7.28px}.pb-\[8px\]{padding-bottom:8px}.pb-\[10px\]{padding-bottom:10px}.pb-\[14px\]{padding-bottom:14px}.pb-\[15px\]{padding-bottom:15px}.pl-\[13px\]{padding-left:13px}.text-center{text-align:center}.text-left{text-align:left}.align-top{vertical-align:top}.font-\[\'Space_Grotesk\'\]{font-family:Space Grotesk}.font-\[Inter\]{font-family:Inter}.font-\[Space_Grotesk\]{font-family:Space Grotesk}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-\[10px\]{font-size:10px}.text-\[12px\]{font-size:12px}.text-\[13px\]{font-size:13px}.text-\[14px\]{font-size:14px}.text-\[16px\]{font-size:16px}.text-\[18px\]{font-size:18px}.text-\[20px\]{font-size:20px}.text-\[22px\]{font-size:22px}.leading-\[14px\]{--tw-leading:14px;line-height:14px}.leading-\[15\.09px\]{--tw-leading:15.09px;line-height:15.09px}.leading-\[15px\]{--tw-leading:15px;line-height:15px}.leading-\[21px\]{--tw-leading:21px;line-height:21px}.leading-\[28px\]{--tw-leading:28px;line-height:28px}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.break-all{word-break:break-all}.text-\[\#000000\]{color:#000}.text-\[\#6B6B6B\]{color:#6b6b6b}.text-\[\#6F6F6F\]{color:#6f6f6f}.text-\[\#8D8D8D\]{color:#8d8d8d}.text-\[\#222\]{color:#222}.text-\[\#414141\]{color:#414141}.text-\[\#646464\]{color:#646464}.text-black{color:var(--color-black)}.text-red-600{color:var(--color-red-600)}.text-white{color:var(--color-white)}.text-yellow-600{color:var(--color-yellow-600)}.opacity-0{opacity:0}.opacity-100{opacity:1}.shadow-\[0_0_0_0\.5px_\#000000\,2px_2px_0px_0px_\#000000\]{--tw-shadow:0 0 0 .5px var(--tw-shadow-color,#000),2px 2px 0px 0px var(--tw-shadow-color,#000);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\[2px_2px_0px_0px_\#000000\]{--tw-shadow:2px 2px 0px 0px var(--tw-shadow-color,#000);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.filter{filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.transition-\[width\]{transition-property:width;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-100{--tw-duration:.1s;transition-duration:.1s}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.ease-\[cubic-bezier\(\.4\,0\,\.2\,1\)\]{--tw-ease:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1)}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-linear{--tw-ease:linear;transition-timing-function:linear}.select-none{-webkit-user-select:none;user-select:none}.dark\:block:where(.dark,.dark *){display:block}.dark\:hidden:where(.dark,.dark *){display:none}.dark\:border-white:where(.dark,.dark *){border-color:var(--color-white)}.dark\:bg-\[\#3F3F3F\]:where(.dark,.dark *){background-color:#3f3f3f}.dark\:bg-\[\#86FFD3\]:where(.dark,.dark *){background-color:#86ffd3}.dark\:bg-\[\#262626\]:where(.dark,.dark *){background-color:#262626}.dark\:bg-\[\#272727\]:where(.dark,.dark *){background-color:#272727}.dark\:bg-black:where(.dark,.dark *){background-color:var(--color-black)}.dark\:text-\[\#86FFD3\]:where(.dark,.dark *){color:#86ffd3}.dark\:text-\[\#727272\]:where(.dark,.dark *){color:#727272}.dark\:text-\[\#949494\]:where(.dark,.dark *){color:#949494}.dark\:text-\[\#AEAEAE\]:where(.dark,.dark *){color:#aeaeae}.dark\:text-\[\#BEBEBE\]:where(.dark,.dark *){color:#bebebe}.dark\:text-\[\#D4D4D4\]:where(.dark,.dark *){color:#d4d4d4}.dark\:text-black:where(.dark,.dark *){color:var(--color-black)}.dark\:text-white:where(.dark,.dark *){color:var(--color-white)}.dark\:shadow-\[0_0_0_0\.5px_\#ffffff\,2px_2px_0px_0px_\#FFFFFF\]:where(.dark,.dark *){--tw-shadow:0 0 0 .5px var(--tw-shadow-color,#fff),2px 2px 0px 0px var(--tw-shadow-color,#fff);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.dark\:shadow-\[2px_2px_0px_0px_\#FFFFFF\]:where(.dark,.dark *){--tw-shadow:2px 2px 0px 0px var(--tw-shadow-color,#fff);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}}:host{--primary-color:#000;--secondary-color:#fff;--tw-border-style:solid;--tw-border-color:#000;--tw-border-width:1px;--tw-border-radius:15px;--tw-border-radius-tl:15px;--tw-border-radius-tr:15px;--tw-border-radius-bl:15px;--tw-border-radius-br:15px;--tw-inset-shadow:0 0 #0000;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000}.material-icons-outlined{letter-spacing:normal;text-transform:none;white-space:nowrap;word-wrap:normal;-webkit-font-feature-settings:"liga";-webkit-font-smoothing:antialiased;cursor:pointer;direction:ltr;font-family:Material Icons Outlined;font-style:normal;font-weight:400;line-height:1;display:inline-block}.inspector-scrollbar::-webkit-scrollbar{width:8px}.inspector-scrollbar::-webkit-scrollbar-track{background:0 0}.inspector-scrollbar::-webkit-scrollbar-thumb{background:#bdbdbd;border-radius:8px}.inspector-scrollbar{scrollbar-width:thin;scrollbar-color:#bdbdbd transparent}.inspector-scrollbar-none::-webkit-scrollbar{display:none}.inspector-scrollbar-none{scrollbar-width:none;-ms-overflow-style:none}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@keyframes spin{to{transform:rotate(360deg)}}</style><div id="widget-mothership" class="
        max-h-[min(750px,100vh)]
        flex flex-col
        relative
        bg-white
        dark:bg-black
        text-black
        dark:text-white
        shadow-[0_0_0_0.5px_#000000,2px_2px_0px_0px_#000000]
        dark:shadow-[0_0_0_0.5px_#ffffff,2px_2px_0px_0px_#FFFFFF]
        rounded-[13px]
        overflow-hidden
        hidden " style="position: fixed; inset: 30px auto auto 1200px; z-index: 9999; width: 384px; height: 600px;"><div class="h-[42px] flex-none flex items-center justify-between pl-[13px] pr-[9px] select-none" style="cursor: grab;"><div class="
        gap-[11px] flex items-center
      "><div class="cursor-grab select-none" id="drag-handle"><img alt="dragHandleDark" class="hidden dark:block h-[24px] w-[24px]" src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_582_7275)'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.75%205.625C6.75%206.24632%206.24632%206.75%205.625%206.75C5.00368%206.75%204.5%206.24632%204.5%205.625C4.5%205.00368%205.00368%204.5%205.625%204.5C6.24632%204.5%206.75%205.00368%206.75%205.625ZM12%204.5C11.3787%204.5%2010.875%205.00368%2010.875%205.625C10.875%206.24632%2011.3787%206.75%2012%206.75C12.6213%206.75%2013.125%206.24632%2013.125%205.625C13.125%205.00368%2012.6213%204.5%2012%204.5ZM18.375%206.75C18.9963%206.75%2019.5%206.24632%2019.5%205.625C19.5%205.00368%2018.9963%204.5%2018.375%204.5C17.7537%204.5%2017.25%205.00368%2017.25%205.625C17.25%206.24632%2017.7537%206.75%2018.375%206.75ZM5.625%2010.875C5.00368%2010.875%204.5%2011.3787%204.5%2012C4.5%2012.6213%205.00368%2013.125%205.625%2013.125C6.24632%2013.125%206.75%2012.6213%206.75%2012C6.75%2011.3787%206.24632%2010.875%205.625%2010.875ZM12%2010.875C11.3787%2010.875%2010.875%2011.3787%2010.875%2012C10.875%2012.6213%2011.3787%2013.125%2012%2013.125C12.6213%2013.125%2013.125%2012.6213%2013.125%2012C13.125%2011.3787%2012.6213%2010.875%2012%2010.875ZM18.375%2010.875C17.7537%2010.875%2017.25%2011.3787%2017.25%2012C17.25%2012.6213%2017.7537%2013.125%2018.375%2013.125C18.9963%2013.125%2019.5%2012.6213%2019.5%2012C19.5%2011.3787%2018.9963%2010.875%2018.375%2010.875ZM5.625%2017.25C5.00368%2017.25%204.5%2017.7537%204.5%2018.375C4.5%2018.9963%205.00368%2019.5%205.625%2019.5C6.24632%2019.5%206.75%2018.9963%206.75%2018.375C6.75%2017.7537%206.24632%2017.25%205.625%2017.25ZM12%2017.25C11.3787%2017.25%2010.875%2017.7537%2010.875%2018.375C10.875%2018.9963%2011.3787%2019.5%2012%2019.5C12.6213%2019.5%2013.125%2018.9963%2013.125%2018.375C13.125%2017.7537%2012.6213%2017.25%2012%2017.25ZM18.375%2017.25C17.7537%2017.25%2017.25%2017.7537%2017.25%2018.375C17.25%2018.9963%2017.7537%2019.5%2018.375%2019.5C18.9963%2019.5%2019.5%2018.9963%2019.5%2018.375C19.5%2017.7537%2018.9963%2017.25%2018.375%2017.25Z'%20fill='%23BEBEBE'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_582_7275'%3e%3crect%20width='24'%20height='24'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"><img alt="dragHandleLight" class="block dark:hidden h-[24px] w-[24px]" src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_484_4648)'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M6.75%205.625C6.75%206.24632%206.24632%206.75%205.625%206.75C5.00368%206.75%204.5%206.24632%204.5%205.625C4.5%205.00368%205.00368%204.5%205.625%204.5C6.24632%204.5%206.75%205.00368%206.75%205.625ZM12%204.5C11.3787%204.5%2010.875%205.00368%2010.875%205.625C10.875%206.24632%2011.3787%206.75%2012%206.75C12.6213%206.75%2013.125%206.24632%2013.125%205.625C13.125%205.00368%2012.6213%204.5%2012%204.5ZM18.375%206.75C18.9963%206.75%2019.5%206.24632%2019.5%205.625C19.5%205.00368%2018.9963%204.5%2018.375%204.5C17.7537%204.5%2017.25%205.00368%2017.25%205.625C17.25%206.24632%2017.7537%206.75%2018.375%206.75ZM5.625%2010.875C5.00368%2010.875%204.5%2011.3787%204.5%2012C4.5%2012.6213%205.00368%2013.125%205.625%2013.125C6.24632%2013.125%206.75%2012.6213%206.75%2012C6.75%2011.3787%206.24632%2010.875%205.625%2010.875ZM12%2010.875C11.3787%2010.875%2010.875%2011.3787%2010.875%2012C10.875%2012.6213%2011.3787%2013.125%2012%2013.125C12.6213%2013.125%2013.125%2012.6213%2013.125%2012C13.125%2011.3787%2012.6213%2010.875%2012%2010.875ZM18.375%2010.875C17.7537%2010.875%2017.25%2011.3787%2017.25%2012C17.25%2012.6213%2017.7537%2013.125%2018.375%2013.125C18.9963%2013.125%2019.5%2012.6213%2019.5%2012C19.5%2011.3787%2018.9963%2010.875%2018.375%2010.875ZM5.625%2017.25C5.00368%2017.25%204.5%2017.7537%204.5%2018.375C4.5%2018.9963%205.00368%2019.5%205.625%2019.5C6.24632%2019.5%206.75%2018.9963%206.75%2018.375C6.75%2017.7537%206.24632%2017.25%205.625%2017.25ZM12%2017.25C11.3787%2017.25%2010.875%2017.7537%2010.875%2018.375C10.875%2018.9963%2011.3787%2019.5%2012%2019.5C12.6213%2019.5%2013.125%2018.9963%2013.125%2018.375C13.125%2017.7537%2012.6213%2017.25%2012%2017.25ZM18.375%2017.25C17.7537%2017.25%2017.25%2017.7537%2017.25%2018.375C17.25%2018.9963%2017.7537%2019.5%2018.375%2019.5C18.9963%2019.5%2019.5%2018.9963%2019.5%2018.375C19.5%2017.7537%2018.9963%2017.25%2018.375%2017.25Z'%20fill='%23141414'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_484_4648'%3e%3crect%20width='24'%20height='24'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"></div><div class="
    text-[13px]
    font-bold
    leading-[28px]
    text-[#414141]
    dark:text-[#BEBEBE]
    font-['Space_Grotesk']
    select-none
    "><span>Inspect Element</span></div></div><div class="flex items-center"><div class="h-[31px] w-[31px] flex items-center justify-center cursor-pointer" id="theme-switch"><img alt="themeSwitchLight" class="block dark:hidden h-[18.6px] w-[18.6px]" src="data:image/svg+xml,%3csvg%20width='19'%20height='19'%20viewBox='0%200%2019%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_582_5156)'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M17.1683%2010.5341C17.0164%2010.3818%2016.7928%2010.3259%2016.5871%2010.3888C14.3289%2011.0715%2011.8782%2010.4564%2010.21%208.7882C8.54183%207.12003%207.92674%204.66935%208.60943%202.41113C8.6728%202.20532%208.6172%201.98134%208.46492%201.82907C8.31265%201.6768%208.08868%201.62119%207.88287%201.68456C6.35057%202.15395%205.00534%203.09467%204.03863%204.37284C2.31424%206.66225%202.03359%209.73019%203.31396%2012.2945C4.59433%2014.8588%207.21529%2016.4779%2010.0814%2016.4752C11.7208%2016.4802%2013.3166%2015.9473%2014.6239%2014.9581C15.9021%2013.9914%2016.8428%2012.6462%2017.3122%2011.1139C17.3748%2010.9089%2017.3195%2010.686%2017.1683%2010.5341ZM13.925%2014.0296C11.3795%2015.9468%207.81083%2015.6969%205.55739%2013.4437C3.30395%2011.1904%203.05378%207.62177%204.9708%205.07616C5.57487%204.27844%206.35583%203.63178%207.25221%203.18709C7.20115%203.54545%207.17541%203.90697%207.1752%204.26895C7.1796%208.44032%2010.5601%2011.8208%2014.7314%2011.8252C15.0942%2011.8251%2015.4564%2011.7993%2015.8155%2011.7482C15.3704%2012.6447%2014.7232%2013.4257%2013.925%2014.0296Z'%20fill='%23414141'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_582_5156'%3e%3crect%20width='18.6'%20height='18.6'%20fill='white'%20transform='translate(0.200195%200.200195)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"><img alt="themeSwitchDark" class="hidden dark:block h-[18.6px] w-[18.6px]" src="data:image/svg+xml,%3csvg%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M9.2999%2011.6249C9.94574%2011.6249%2010.4947%2011.3989%2010.9468%2010.9468C11.3989%2010.4947%2011.6249%209.94574%2011.6249%209.2999C11.6249%208.65407%2011.3989%208.10511%2010.9468%207.65303C10.4947%207.20094%209.94574%206.9749%209.2999%206.9749C8.65407%206.9749%208.10511%207.20094%207.65303%207.65303C7.20094%208.10511%206.9749%208.65407%206.9749%209.2999C6.9749%209.94574%207.20094%2010.4947%207.65303%2010.9468C8.10511%2011.3989%208.65407%2011.6249%209.2999%2011.6249ZM9.2999%2013.1749C8.22782%2013.1749%207.31397%2012.7971%206.55834%2012.0415C5.80272%2011.2858%205.4249%2010.372%205.4249%209.2999C5.4249%208.22782%205.80272%207.31397%206.55834%206.55834C7.31397%205.80272%208.22782%205.4249%209.2999%205.4249C10.372%205.4249%2011.2858%205.80272%2012.0415%206.55834C12.7971%207.31397%2013.1749%208.22782%2013.1749%209.2999C13.1749%2010.372%2012.7971%2011.2858%2012.0415%2012.0415C11.2858%2012.7971%2010.372%2013.1749%209.2999%2013.1749ZM3.8749%2010.0749H0.774902V8.5249H3.8749V10.0749ZM17.8249%2010.0749H14.7249V8.5249H17.8249V10.0749ZM8.5249%203.8749V0.774902H10.0749V3.8749H8.5249ZM8.5249%2017.8249V14.7249H10.0749V17.8249H8.5249ZM4.9599%206.00615L3.00303%204.12678L4.1074%202.98365L5.9674%204.92115L4.9599%206.00615ZM14.4924%2015.6162L12.613%2013.6593L13.6399%2012.5937L15.5968%2014.473L14.4924%2015.6162ZM12.5937%204.9599L14.473%203.00303L15.6162%204.1074L13.6787%205.9674L12.5937%204.9599ZM2.98365%2014.4924L4.94053%2012.613L6.00615%2013.6399L4.12678%2015.5968L2.98365%2014.4924Z'%20fill='%23EBEBEB'/%3e%3c/svg%3e"></div><div class="h-[31px] w-[31px] flex items-center justify-center cursor-pointer" id="close-icon"><img alt="closeIconLight" class="block dark:hidden h-[18.6px] w-[18.6px]" src="data:image/svg+xml,%3csvg%20width='19'%20height='19'%20viewBox='0%200%2019%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_582_5161)'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15.1427%2014.3202C15.3698%2014.5473%2015.3698%2014.9156%2015.1427%2015.1427C14.9156%2015.3698%2014.5473%2015.3698%2014.3202%2015.1427L9.5002%2010.3219L4.68018%2015.1427C4.45306%2015.3698%204.08483%2015.3698%203.85771%2015.1427C3.63059%2014.9156%203.63059%2014.5473%203.85771%2014.3202L8.67845%209.5002L3.85771%204.68018C3.63059%204.45306%203.63059%204.08483%203.85771%203.85771C4.08483%203.63059%204.45306%203.63059%204.68018%203.85771L9.5002%208.67845L14.3202%203.85771C14.5473%203.63059%2014.9156%203.63059%2015.1427%203.85771C15.3698%204.08483%2015.3698%204.45306%2015.1427%204.68018L10.3219%209.5002L15.1427%2014.3202Z'%20fill='%23414141'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_582_5161'%3e%3crect%20width='18.6'%20height='18.6'%20fill='white'%20transform='translate(0.200195%200.200195)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"><img alt="closeIconDark" class="hidden dark:block h-[18.6px] w-[18.6px]" src="data:image/svg+xml,%3csvg%20width='19'%20height='19'%20viewBox='0%200%2019%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_582_7405)'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M15.1427%2014.3202C15.3698%2014.5473%2015.3698%2014.9156%2015.1427%2015.1427C14.9156%2015.3698%2014.5473%2015.3698%2014.3202%2015.1427L9.5002%2010.3219L4.68018%2015.1427C4.45306%2015.3698%204.08483%2015.3698%203.85771%2015.1427C3.63059%2014.9156%203.63059%2014.5473%203.85771%2014.3202L8.67845%209.5002L3.85771%204.68018C3.63059%204.45306%203.63059%204.08483%203.85771%203.85771C4.08483%203.63059%204.45306%203.63059%204.68018%203.85771L9.5002%208.67845L14.3202%203.85771C14.5473%203.63059%2014.9156%203.63059%2015.1427%203.85771C15.3698%204.08483%2015.3698%204.45306%2015.1427%204.68018L10.3219%209.5002L15.1427%2014.3202Z'%20fill='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_582_7405'%3e%3crect%20width='18.6'%20height='18.6'%20fill='white'%20transform='translate(0.200195%200.200195)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"></div></div></div><div class="flex-1 overflow-auto inspector-scrollbar inspector-scrollbar-none overscroll-contain"><div class="px-[16px]"><div class="
                pt-[20px]
                pb-[15px]
            "><div id="inspector-title" class="
                        dark:text-white
                        text-black
                        text-[22px]
                        font-bold
                        leading-[28px]
                        font-['Space_Grotesk']
                        flex
                        items-center
                        justify-between
                    "><span>About this page</span></div></div><div class="flex flex-col"><div class="grid grid-cols-20 gap-[0px] pb-[10px]"><div class="col-span-8 text-[14px] leading-[21px] text-[#646464] dark:text-[#D4D4D4] flex justify-items-start font-[Inter] font-normal"><span>Font Family</span></div><div class="col-span-12 text-[14px] leading-[21px] text-[#000000] dark:text-[#86FFD3] flex items-center gap-x-[11px] justify-items-start font-[Inter] font-normal text-left"><span>Inter, Helvetica, sans-serif</span></div></div><div class="grid grid-cols-20 gap-[0px] pb-[10px]"><div class="col-span-8 text-[14px] leading-[21px] text-[#646464] dark:text-[#D4D4D4] flex justify-items-start font-[Inter] font-normal"><span>Background Color</span></div><div class="col-span-12 text-[14px] leading-[21px] text-[#000000] dark:text-[#86FFD3] flex items-center gap-x-[11px] justify-items-start font-[Inter] font-normal text-left"><div class="w-[18px] h-[18px] rounded-[3px] border-[0.5px] border-black dark:border-white" style="background-color: rgb(252, 252, 252);"></div><span>#FCFCFC</span></div></div><div class="grid grid-cols-20 gap-[0px] "><div class="col-span-8 text-[14px] leading-[21px] text-[#646464] dark:text-[#D4D4D4] flex justify-items-start font-[Inter] font-normal"><span>Color</span></div><div class="col-span-12 text-[14px] leading-[21px] text-[#000000] dark:text-[#86FFD3] flex items-center gap-x-[11px] justify-items-start font-[Inter] font-normal text-left"><div class="w-[18px] h-[18px] rounded-[3px] border-[0.5px] border-black dark:border-white" style="background-color: rgb(7, 20, 55);"></div><span>#071437</span></div></div></div><div class="h-[160px]"></div></div></div><div><div class="
            feedback-panel 
            z-50
            w-full
            text-slate-80
            flex justify-center items-center
            gap-[15px]
                pt-[8px]
                pb-[7.28px]
            bg-[#F9F9F9]
            dark:bg-[#272727]
            select-none
        " id="feedbackPanel"><p class="
            font-medium text-[12px] leading-[14px] font-['Space_Grotesk'] 
            text-[#6F6F6F] dark:text-[#AEAEAE]
            ">Rate us:</p><div class="feedback-stars flex gap-[5px]"><span class="material-icons-outlined text-[18px] cursor-pointer transition-colors duration-150 ease-in-out" style="color: rgb(255, 225, 51);">star</span><span class="material-icons-outlined text-[18px] cursor-pointer transition-colors duration-150 ease-in-out" style="color: rgb(255, 225, 51);">star</span><span class="material-icons-outlined text-[18px] cursor-pointer transition-colors duration-150 ease-in-out" style="color: rgb(255, 225, 51);">star</span><span class="material-icons-outlined text-[18px] cursor-pointer transition-colors duration-150 ease-in-out" style="color: rgb(255, 225, 51);">star</span><span class="material-icons-outlined text-[18px] cursor-pointer transition-colors duration-150 ease-in-out" style="color: rgb(255, 225, 51);">star</span></div></div><div class="relative h-[56px] flex flex-none items-end px-[16px] pb-[10px] dark:text-[#727272] text-[#8D8D8D] text-[10px] leading-[21px] select-none "><div class="grid grid-cols-2 gap-[10px]"><div class="flex flex-col justify-left"><span class="text-left font-[Inter]"><b>Esc</b> - close ext</span><span class="text-left font-[Inter]"><b>C</b> - copy CSS code</span></div><div class="flex flex-col justify-left"><span class="text-left font-[Inter]">‎ </span><span class="text-left font-[Inter]"><b>Alt</b> + <b>E</b> - open widget</span></div></div></div></div><div class="cursor-nwse-resize" style="position: absolute; bottom: 0px; right: 0px; width: 8px; height: 10px; cursor: nwse-resize;"></div></div></template></div><iframe id="intercom-frame" style="position: absolute !important; opacity: 0 !important; width: 1px !important; height: 1px !important; top: 0 !important; left: 0 !important; border: none !important; display: block !important; z-index: -1 !important; pointer-events: none;" aria-hidden="true" tabindex="-1" title="Intercom"></iframe><div class="intercom-lightweight-app"><div class="intercom-lightweight-app-launcher intercom-launcher" role="button" tabindex="0" aria-label="Open Intercom Messenger" aria-live="polite"><div class="intercom-lightweight-app-launcher-icon intercom-lightweight-app-launcher-icon-open"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 32"><path d="M28 32s-4.714-1.855-8.527-3.34H3.437C1.54 28.66 0 27.026 0 25.013V3.644C0 1.633 1.54 0 3.437 0h21.125c1.898 0 3.437 1.632 3.437 3.645v18.404H28V32zm-4.139-11.982a.88.88 0 00-1.292-.105c-.03.026-3.015 2.681-8.57 2.681-5.486 0-8.517-2.636-8.571-2.684a.88.88 0 00-1.29.107 1.01 1.01 0 00-.219.708.992.992 0 00.318.664c.142.128 3.537 3.15 9.762 3.15 6.226 0 9.621-3.022 9.763-3.15a.992.992 0 00.317-.664 1.01 1.01 0 00-.218-.707z"></path></svg></div><div class="intercom-lightweight-app-launcher-icon intercom-lightweight-app-launcher-icon-minimize"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18.601 8.39897C18.269 8.06702 17.7309 8.06702 17.3989 8.39897L12 13.7979L6.60099 8.39897C6.26904 8.06702 5.73086 8.06702 5.39891 8.39897C5.06696 8.73091 5.06696 9.2691 5.39891 9.60105L11.3989 15.601C11.7309 15.933 12.269 15.933 12.601 15.601L18.601 9.60105C18.9329 9.2691 18.9329 8.73091 18.601 8.39897Z" fill="currentColor"></path>
</svg>
</div></div><style id="intercom-lightweight-app-style" type="text/css">
  @keyframes intercom-lightweight-app-launcher {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes intercom-lightweight-app-gradient {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes intercom-lightweight-app-messenger {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    40% {
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }

  .intercom-lightweight-app {
    position: fixed;
    z-index: 2147483001;
    width: 0;
    height: 0;
    font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  .intercom-lightweight-app-gradient {
    position: fixed;
    z-index: 2147483002;
    width: 500px;
    height: 500px;
    bottom: 0;
    right: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse at bottom right,
      rgba(29, 39, 54, 0.16) 0%,
      rgba(29, 39, 54, 0) 72%);
    animation: intercom-lightweight-app-gradient 200ms ease-out;
  }

  .intercom-lightweight-app-launcher {
    position: fixed;
    z-index: 2147483003;
    padding: 0 !important;
    margin: 0 !important;
    border: none;
    bottom: 20px;
    right: 20px;
    max-width: 48px;
    width: 48px;
    max-height: 48px;
    height: 48px;
    border-radius: 50%;
    background: #5595df;
    cursor: pointer;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.06), 0 2px 32px 0 rgba(0, 0, 0, 0.16);
    transition: transform 167ms cubic-bezier(0.33, 0.00, 0.00, 1.00);
    box-sizing: content-box;
  }


  .intercom-lightweight-app-launcher:hover {
    transition: transform 250ms cubic-bezier(0.33, 0.00, 0.00, 1.00);
    transform: scale(1.1)
  }

  .intercom-lightweight-app-launcher:active {
    transform: scale(0.85);
    transition: transform 134ms cubic-bezier(0.45, 0, 0.2, 1);
  }


  .intercom-lightweight-app-launcher:focus {
    outline: none;

    
  }

  .intercom-lightweight-app-launcher-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    height: 48px;
    transition: transform 100ms linear, opacity 80ms linear;
  }

  .intercom-lightweight-app-launcher-icon-open {
    
        opacity: 1;
        transform: rotate(0deg) scale(1);
      
  }

  .intercom-lightweight-app-launcher-icon-open svg {
    width: 24px;
    height: 24px;
  }

  .intercom-lightweight-app-launcher-icon-open svg path {
    fill: rgb(255, 255, 255);
  }

  .intercom-lightweight-app-launcher-icon-self-serve {
    
        opacity: 1;
        transform: rotate(0deg) scale(1);
      
  }

  .intercom-lightweight-app-launcher-icon-self-serve svg {
    height: 44px;
  }

  .intercom-lightweight-app-launcher-icon-self-serve svg path {
    fill: rgb(255, 255, 255);
  }

  .intercom-lightweight-app-launcher-custom-icon-open {
    max-height: 24px;
    max-width: 24px;

    
        opacity: 1;
        transform: rotate(0deg) scale(1);
      
  }

  .intercom-lightweight-app-launcher-icon-minimize {
    
        opacity: 0;
        transform: rotate(-60deg) scale(0);
      
  }

  .intercom-lightweight-app-launcher-icon-minimize svg path {
    fill: rgb(255, 255, 255);
  }

  /* Extended launcher styles */
  .intercom-lightweight-app-launcher.intercom-launcher-extended {
    width: calc(180px - 30px);
    max-width: calc(180px - 30px);
    height: calc(45px - 26px);
    max-height: calc(45px - 26px);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 16px 12px 12px !important;
    gap: 6px;
    /* Use theme background instead of hardcoded gradient */
    background: #5595df;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0px -2px 50px rgba(0, 0, 0, 0.1);
    
  }

  .intercom-lightweight-app-launcher.intercom-launcher-extended .intercom-lightweight-app-launcher-icon {
    position: relative;
    width: 24px;
    height: 24px;
  }

  .intercom-lightweight-app-launcher-text {
    /* Match text color with launcher icon */
    color: rgb(255, 255, 255);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
    opacity: 1;
    transition: opacity 80ms linear;
  }

  .intercom-lightweight-app-messenger {
    position: fixed;
    z-index: 2147483003;
    overflow: hidden;
    background-color: #ffffff;
    animation: intercom-lightweight-app-messenger 250ms cubic-bezier(0, 1, 1, 1);
    transform-origin: bottom right;

    
        width: 400px;
        height: calc(100% - 104px);
        max-height: 704px;
        min-height: 250px;
        right: 20px;
        bottom: 84px;
        box-shadow: 0 5px 40px rgba(0,0,0,0.16);
      

    border-radius: 24px;
  }

  .intercom-lightweight-app-messenger-header {
    height: 64px;
    border-bottom: none;
    background: #ffffff;
  }

  .intercom-lightweight-app-messenger-footer{
    position:absolute;
    bottom:0;
    width: 100%;
    height: 80px;
    background: #ffffff;
    font-size: 14px;
    line-height: 21px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.05);
  }

  @media print {
    .intercom-lightweight-app {
      display: none;
    }
  }
</style></div><div id="pdfready"></div><div class="app-header-menu app-header-mobile-drawer align-items-stretch w-xl-100 drawer drawer-end" data-kt-drawer="true" data-kt-drawer-name="app-header-menu" data-kt-drawer-activate="{default: true, xl: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="250px" data-kt-drawer-direction="end" data-kt-drawer-toggle="#kt_app_header_menu_toggle" data-kt-swapper="true" data-kt-swapper-mode="{default: 'append', xl: 'append'}" data-kt-swapper-parent="{default: '#kt_app_body', xl: '#kt_app_header_logo_form'}" style="width: 250px !important;">
                <div class="menu menu-rounded menu-column menu-xl-row my-5 my-xl-0 align-items-stretch fw-semibold px-2 px-xl-0 ps-xl-8 justify-content-xl-between w-xl-100" id="kt_app_header_menu" data-kt-menu="true">
                            <div data-kt-menu-trigger="{default: 'click', xl: 'hover'}" data-kt-menu-placement="bottom-start" class="menu-item menu-xl-down-accordion menu-sub-xl-down-indention me-0 me-xl-2">
                                <span class="menu-link px-xl-2">
                                    <span class="menu-title">Features</span>
                                    <span class="menu-arrow d-xl-none"></span>
                                </span>
                            <div class="menu-sub menu-sub-xl-down-accordion menu-sub-xl-dropdown p-0 w-225px w-xl-600px ms-0">
                    <div class="menu-state-bg menu-extended py-xl-6 px-xl-6" data-kt-menu-dismiss="true">
                        <div class="row ms-n4">
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/white-label/" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-some-files  fs-1 text-danger">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">White Label Reports</span>
                                                <span class="fs-7 fw-semibold text-muted">Create beautiful branded SEO Audits in PDF</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/embeddable-audit-tool/" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-frame  fs-1 text-cyan">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">Embeddable Audit Tool</span>
                                                <span class="fs-7 fw-semibold text-muted">Generate more leads and sales from your site</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/keyword-research-tool/" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-chart-simple-3  fs-1 text-primary">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">Keyword Research Tool</span>
                                                <span class="fs-7 fw-semibold text-muted">Find the right keywords for your site to rank</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/keyword-tracking-tool/" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-key  fs-1 text-success">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">Keyword Tracking Tool</span>
                                                <span class="fs-7 fw-semibold text-muted">Monitor the success of your SEO efforts</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/backlink-checker/" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-fasten  fs-1 text-warning">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">Backlink Checker</span>
                                                <span class="fs-7 fw-semibold text-muted">Get the details behind a domain</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/monitor-backlinks/" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-graph-up  fs-1 text-info">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">Backlink Monitoring</span>
                                                <span class="fs-7 fw-semibold text-muted">Track backlink changes over time</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/seo-crawler/" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-search-list  fs-1 text-danger">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">SEO Crawler</span>
                                                <span class="fs-7 fw-semibold text-muted">Scan every page of a site in depth for problems</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/bulk-reporting/" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-abstract-26  fs-1 text-cyan">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">Bulk Reporting</span>
                                                <span class="fs-7 fw-semibold text-muted">Dominate prospecting &amp; lead gen at scale</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/seo-api/" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-cloud-download  fs-1 text-primary">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">API</span>
                                                <span class="fs-7 fw-semibold text-muted">Build custom solutions with 100+ data points</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                            <div class="col-xl-6 mb-xl-3">
                                    <div class="menu-item p-0 m-0">
                                        <a href="/free-tools" class="menu-link ">
                                            <span class="menu-custom-icon d-flex flex-center flex-shrink-0 rounded w-40px h-40px me-3">
                                                <i class="ki-duotone ki-wrench  fs-1 text-success">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                    <span class="path5"></span>
                                                    <span class="path6"></span>
                                                </i>
                                            </span>
                                            <span class="d-flex flex-column">
                                                <span class="fs-6 fw-bold text-gray-800">Free Tools</span>
                                                <span class="fs-7 fw-semibold text-muted">Perform any SEO task with 60+ tools</span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                                    </div>
                    </div>
                </div>
                    </div>
                            <div data-kt-menu-trigger="{default: 'click', xl: 'hover'}" data-kt-menu-placement="bottom-start" class="menu-item menu-xl-down-accordion menu-sub-xl-down-indention me-0 me-xl-2">
                        <a class="menu-link" href="/pricing/" target="_self">
                        
                        <span class="menu-title">Pricing</span>
                        
                        </a>
                        
                        </div>                        <div data-kt-menu-trigger="{default: 'click', xl: 'hover'}" data-kt-menu-placement="bottom-start" class="menu-item menu-xl-down-accordion menu-sub-xl-down-indention me-0 me-xl-2">
                        <span class="menu-link px-xl-2">
                        
                        <span class="menu-title">Resources</span>
                        <span class="menu-arrow d-xl-none"></span>
                        </span>
                        <div class="menu-sub menu-sub-xl-down-accordion menu-sub-xl-dropdown py-xl-4 w-xl-225px"><div data-kt-menu-trigger="{default:'click', lg: 'hover'}" data-kt-menu-placement="right-start" class="menu-item menu-lg-down-accordion">
                        <span class="menu-link">
                            <span class="menu-icon">
                                <i class="ki-duotone ki-notepad-edit fs-2"><span class="path1"></span><span class="path2"></span></i>
                            </span>
                            <span class="menu-title">Blog Home</span>
                            <span class="menu-arrow"></span>
                        </span>
                        <div class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-active-bg px-lg-2 py-lg-4 w-lg-200px" style="display: none; overflow: hidden;"><div class="menu-item">
                            <a class="menu-link" href="/blog/">
                                <span class="menu-bullet">
                                    <span class="bullet bullet-dot"></span>
                                </span>
                                <span class="menu-title">English</span>
                            </a>
                        </div><div class="menu-item">
                            <a class="menu-link" href="/fr/blog/">
                                <span class="menu-bullet">
                                    <span class="bullet bullet-dot"></span>
                                </span>
                                <span class="menu-title">French</span>
                            </a>
                        </div><div class="menu-item">
                            <a class="menu-link" href="/es/blog/">
                                <span class="menu-bullet">
                                    <span class="bullet bullet-dot"></span>
                                </span>
                                <span class="menu-title">Spanish</span>
                            </a>
                        </div><div class="menu-item">
                            <a class="menu-link" href="/id/blog/">
                                <span class="menu-bullet">
                                    <span class="bullet bullet-dot"></span>
                                </span>
                                <span class="menu-title">Bahasa Indonesia</span>
                            </a>
                        </div><div class="menu-item">
                            <a class="menu-link" href="/ja/blog/">
                                <span class="menu-bullet">
                                    <span class="bullet bullet-dot"></span>
                                </span>
                                <span class="menu-title">日本語</span>
                            </a>
                        </div><div class="menu-item">
                            <a class="menu-link" href="/pl/blog/">
                                <span class="menu-bullet">
                                    <span class="bullet bullet-dot"></span>
                                </span>
                                <span class="menu-title">Polski</span>
                            </a>
                        </div></div></div><div class="menu-item "><a class="menu-link" href="/blog/category/seoptimer-help/" target="_blank" title="SEOptimer Guides">
                            <span class="menu-icon"><i class="ki-duotone ki-book-square fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i></span>
                            <span class="menu-title">SEOptimer Guides</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.youtube.com/user/Seoptimer/videos" target="_blank" title="Product Videos (YouTube)">
                            <span class="menu-icon"><i class="ki-duotone ki-youtube fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i></span>
                            <span class="menu-title">Product Videos (YouTube)</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="/blog/category/seo/" target="_blank" title="SEO Concepts">
                            <span class="menu-icon"><i class="ki-duotone ki-tablet-book fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i></span>
                            <span class="menu-title">SEO Concepts</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="/blog/category/agency/" target="_blank" title="Agency Guides">
                            <span class="menu-icon"><i class="ki-duotone ki-document fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i></span>
                            <span class="menu-title">Agency Guides</span>
                        </a></div><div class="menu-item js-intercom-show"><a class="menu-link" href="javascript:void(0);" target="_self" title="Live Chat">
                            <span class="menu-icon"><i class="ki-duotone ki-message-notif fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i></span>
                            <span class="menu-title">Live Chat</span>
                        </a></div></div>
                        </div><div class="flex-xl-grow-1 d-none d-xl-block"></div>                        <div data-kt-menu-trigger="{default: 'click', xl: 'hover'}" data-kt-menu-placement="bottom-start" class="menu-item menu-xl-down-accordion menu-sub-xl-down-indention me-0 me-xl-2">
                        <span class="menu-link px-xl-2 me-xl-n4">
                        <span class="w-20px h-20px me-2 rounded-1 m-r-0 flag-icon flag-icon-us"></span>
                        <span class="menu-title"><span class="d-xl-none">English (US)</span></span>
                        <span class="menu-arrow d-xl-none"></span>
                        </span>
                        <div class="menu-sub menu-sub-xl-down-accordion menu-sub-xl-dropdown py-xl-4 w-xl-225px"><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/fr/kommentify.com" target="_self" title="French">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-fr"></span>
                            <span class="menu-title">French</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/es/kommentify.com" target="_self" title="Spanish">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-es"></span>
                            <span class="menu-title">Spanish</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/de/kommentify.com" target="_self" title="German">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-de"></span>
                            <span class="menu-title">German</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/it/kommentify.com" target="_self" title="Italian">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-it"></span>
                            <span class="menu-title">Italian</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/pt/kommentify.com" target="_self" title="Portuguese">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-pt"></span>
                            <span class="menu-title">Portuguese</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/nl/kommentify.com" target="_self" title="Dutch">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-nl"></span>
                            <span class="menu-title">Dutch</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/pl/kommentify.com" target="_self" title="Polish">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-pl"></span>
                            <span class="menu-title">Polish</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/da/kommentify.com" target="_self" title="Danish">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-dk"></span>
                            <span class="menu-title">Danish</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/id/kommentify.com" target="_self" title="Indonesian">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-id"></span>
                            <span class="menu-title">Indonesian</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/tr/kommentify.com" target="_self" title="Turkish">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-tr"></span>
                            <span class="menu-title">Turkish</span>
                        </a></div><div class="menu-item "><a class="menu-link" href="https://www.seoptimer.com/ja/kommentify.com" target="_self" title="Japanese">
                            <span class="w-20px h-20px me-4 rounded-1 flag-icon flag-icon-jp"></span>
                            <span class="menu-title">Japanese</span>
                        </a></div></div>
                        </div>                        <div data-kt-menu-trigger="{default: 'click', xl: 'hover'}" data-kt-menu-placement="bottom-start" class="menu-item menu-xl-down-accordion menu-sub-xl-down-indention me-0 me-xl-2">
                        <a class="menu-link" href="/login" target="_self">
                        
                        <span class="menu-title">Login</span>
                        
                        </a>
                        
                        </div>                        <div data-kt-menu-trigger="{default: 'click', xl: 'hover'}" data-kt-menu-placement="bottom-start" class="menu-item menu-xl-down-accordion menu-sub-xl-down-indention me-0 me-xl-2">
                        <a class="btn btn-flex btn-icon fw-bold btn-warning w-100 h-35px h-md-40px px-4" href="/register" target="_self">
                        
                        <span class="menu-title"><span class="text-nowrap">Premium - Free Trial</span></span>
                        
                        </a>
                        
                        </div>                </div>
            </div></body>