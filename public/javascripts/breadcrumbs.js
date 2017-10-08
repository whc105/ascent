/*global $*/
/*global URL*/
/*global url*/

function createBreadCrumbs(){
    url = new URL(window.location.href);  
    createBC(decodeURI(url.pathname));
}

//Parses the URL
function createBC(pathname){
    var constructURL = '/';
    var totalPath = pathname.length;
    var previousSlash = 1;
    var crumbs;
    if (pathname !== '/') {
        $('#footer').append('<div class="btn-group btn-breadcrumb"><a href="/" class="btn btn-default"><i class="glyphicon glyphicon-home"></i></a></div>');
    }
    for (var count = 1; count < totalPath; count++) {
        if (pathname.charAt(count) === '/') {
            constructURL = constructURL + pathname.substring(previousSlash, count) + '/';
            if (count != totalPath - 1) {
                crumbs = pathname.substring(previousSlash, count).toLowerCase();
                crumbs = crumbs.charAt(0).toUpperCase() + crumbs.substring(1, crumbs.length);
                $('#footer').append('<div class="btn-group btn-breadcrumb"><a href="' + constructURL + '" class="btn btn-default">' + crumbs + '</a></div>');
                previousSlash = count + 1;
            }
            else {
                crumbs = pathname.substring(previousSlash, count).toLowerCase();
                crumbs = crumbs.charAt(0).toUpperCase() + crumbs.substring(1, crumbs.length);
                $('#footer').append('<div class="btn-group btn-breadcrumb"><a href="' + constructURL + '" class="btn btn-default active">' + crumbs + '</a></div>');
            }
        }
        else if (count == totalPath - 1) {
            crumbs = pathname.substring(previousSlash, count + 1).toLowerCase();
            crumbs = crumbs.charAt(0).toUpperCase() + crumbs.substring(1, crumbs.length);
            constructURL = constructURL + pathname.substring(previousSlash, count + 1);
            $('#footer').append('<div class="btn-group btn-breadcrumb"><a href="' + constructURL + '" class="btn btn-default active">' + crumbs + '</a></div>');
        }
    }
}