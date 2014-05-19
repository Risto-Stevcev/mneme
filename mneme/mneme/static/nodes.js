var mneme = {};

var default_width = 1600;
var default_height = 740;

function saveMneme() {
    $("input[name=mnemebody]").val(JSON.stringify(mneme));
    $("#mneme-form").submit();
}

function deleteMneme(mnemetitle) {
    var confirm_delete=confirm("Are you sure you want to delete '" + mnemetitle + "'?");
    if (confirm_delete == false) { return false; };
 
    $("input[name=mnemetitle]").val(mnemetitle);
    $("input[name=mnemedelete]").val("true");
    $("#mneme-form").submit();
}

var edited = false;



function deleteNode (path) {
    var confirm_delete=confirm("Are you sure you want to delete this node?");
    if (confirm_delete == false) { return false; };
    
    var original_path = path;
    var path = path.split('>'),
        parent = mneme,
        selector;
    
    var subparent = null;
    var sparent = null;
    for (var i = 0; i < path.length -1; i += 1) {
        if (i == path.length -3) { subparent = parent[path[i]]; };
        if (i == path.length -4) { sparent = parent[path[i]]; };
        parent = parent[path[i]];
    }
    var topnode = false;
    if (sparent == null) { 
        subparent = mneme.body;
        topnode = true;
    };
    
    var node = path[path.length - 1];
    var new_list = [];

    $.each(subparent, function(key, value) {
        if(typeof value != "string") {
            $.each(value, function(k, v) {
                if (k != node) { new_list.push(value); }; 
            });
        }
    });
    if (topnode == false) {
        sparent[path[path.length-3]] = new_list;
    }
    else {
        mneme.body = new_list;
    };
    $("#nav").html("");
    $("#content").html("");
    populateTree($("#tree"), $("#content"));
}

function displayObject (path) {
    edited = false;
    var original_path = path;
    var path = path.split('>'),
        parent = mneme,
        selector;
    
    for (var i = 0; i < path.length -1; i += 1) {
        parent = parent[path[i]];
    }
    $("#nav").html("");
    $("#nav").append($("<ul id=\"navlist\">"+
                       "<li><a href=\"#\" id=\"edit-button\" onclick=\"displayEdit('"+original_path+"')\">Edit</a></li>"+ 
                       "</ul>"));
    md_html = marked(parent[path[path.length-1]]);
    $("#content").html(md_html);
}

function getSelection(textarea) {
    var len = textarea.value.length;
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    return textarea.value.substring(start, end); 
}

function displayEdit (path) {
    var original_path = path;
    var path = path.split('>'),
        parent = mneme,
        selector;

    for (var i = 0; i < path.length -1; i += 1) {
        parent = parent[path[i]];
    }
    
    $("#nav").html("");
    $("#nav").append($("<ul id=\"navlist\">"+
                       "<li><a href=\"#\" id=\"view-button\" onclick=\"displayObject('"+original_path+"')\">View</a></li>"+
                       "<li><a href=\"#\" id=\"save-node\" onclick=\"saveNode('"+original_path+"')\">Save</a></li>"+
                       "</ul>"));
    md_html = parent[path[path.length-1]];
    $("#content").html("<textarea rows=\"12\" cols=\"80\" id=\"edit-node\">" + 
                       md_html + "</textarea>");

    $("#edit-node").keydown(function (event) {
        if ((event.keyCode != 16 && event.keyCode != 17) && 
            (event.keyCode < 37 || event.keyCode > 40)) {
            if (!edited) {
                edited = true;
                $("#save-node").html("[Save]");
            }
        }
    });
}

function saveNode (path) {
    var path = path.split('>'),
        parent = mneme,
        selector;

    for (var i = 0; i < path.length -1; i += 1) {
        parent = parent[path[i]];
    }

    parent[path[path.length-1]] = $("#edit-node").val();

    $("#save-node").html("Save");
    edited = false;
}

function addNode (path) {
    var subnode_name = prompt("Enter a name for the subnode:","SubNode");
    if (subnode_name == null) { return; };
    var subnode_value = prompt("Enter a value for the subnode:","SubNode Value");
    if (subnode_value == null) { return; };

    if (subnode_name.indexOf("\"") > -1) {
        alert("Error: You cannot use quotation marks in node names.");
        return;
    };
    subnode_name = subnode_name.split("'").join("’");
            
    var path = path.split('>'),
        parent = mneme,
        selector;

    for (var i = 0; i < path.length -1; i += 1) {
        parent = parent[path[i]];
    }
    
    var node_value = parent[path[path.length-1]];
    if (typeof node_value == "string") {
        var confirm_keep = confirm("Create a new node with the current node's value??");
        if (confirm_keep == true) {
            var node_name = prompt("Enter a name for the current node:", "CurNode");
            if (node_name == null) { return; };
            if (node_name.indexOf("\"") > -1) {
                alert("Error: You cannot use quotation marks in node names.");
                return;
            };
            node_name = node_name.split("'").join("’");

            var node_obj = {};
            node_obj[node_name] = node_value;
        };

        var subnode_obj = {};
        subnode_obj[subnode_name] = subnode_value;
        parent[path[path.length-1]] = [];
        if (confirm_keep == true) {
            parent[path[path.length-1]].push(node_obj);
        };
        parent[path[path.length-1]].push(subnode_obj);
    }
    else {
        var subnode_obj = {};
        subnode_obj[subnode_name] = subnode_value;
        parent[path[path.length-1]].push(subnode_obj);
    }; 
    populateTree($('#tree'), $('#content'));
}

function addTopNode () {
    var node_name = prompt("Enter a name for the node:","Node");
    if (node_name == null) { return; }
    var node_value = prompt("Enter a value for the node:","Node Value");
    if (node_value == null) { return; }

    if (node_name.indexOf("\"") > -1) {
        alert("Error: You cannot use quotation marks in node names.");
        return;
    };
    node_name = node_name.split("'").join("’");
 
    var node_obj = {};
    node_obj[node_name] = node_value;

    mneme.body.push(node_obj);
    populateTree($('#tree'), $('#content'));
}

function populateTree (tree, content) {
    tree.html("");
    content.html("");
    appendNodes (mneme.body, tree, "body");
}

function appendNodes (item, element, path) {
    if (item instanceof Array) {
        $.each(item, function(key, value) {
            appendNodes (value, element, path + ">" + key);
        });
    }
    else if (item instanceof Object) {
        $.each(item, function(key, value) {
            var curpath = path + ">" + key;
            if (typeof value == "string") {
                element.append($("<li>" + 
                    "[<a href=\"#\" onclick=\"addNode('"+curpath+"')\">+</a> / " + 
                    "<a href=\"#\" onclick=\"deleteNode('"+curpath+"')\">&#8211;</a>] " + 
                    "<a href=\"#\" onclick=\"displayObject('"+curpath+"')\">" + key +"</a></li>"));
            }
            else {
                var new_elem = $("<ul/>");
                element.append($("<li>" + 
                    "[<a href=\"#\" onclick=\"addNode('"+curpath+"')\">+</a> / " + 
                    "<a href=\"#\" onclick=\"deleteNode('"+curpath+"')\">&#8211;</a>] " + key + "</li>").append(new_elem));
                appendNodes(value, new_elem, path + ">" + key);
            };
        });
    }
}

function adjustIconSize () {
    var width_weight = $(window).width()/default_width;
    var height_weight = $(window).height()/default_height;

    if ($(window).height() > $(window).width()) {
        var aspect_ratio = $(window).width() / $(window).height();
        height_weight = ($(window).width() * aspect_ratio) / default_height;
    };

    var image = new Image();
    $(image)
        .attr("src", $("#topbar img").attr("src"))
        .load(function () {
            $("#topbar img")
                .css({'width' : image.naturalWidth * width_weight, 
                      'height': image.naturalHeight * height_weight});
        });
}

$(window).keypress(function(event) {
    if (event.which == 115 && event.ctrlKey) {
        if ($("#save-node").length) {
            $("#save-node").click();
        }
        event.preventDefault();
        return false;
    }
    else if (event.keyCode == 33 && event.ctrlKey && event.altKey) {
        $("#view-button").click();
        $("#edit-button").focus();
    }
    else if (event.keyCode == 34 && event.ctrlKey && event.altKey) {
        $("#edit-button").click();
        $("#edit-node").focus();
    }
});

$(document).keydown(function(event) {
    if (event.keyCode == 9)
        event.preventDefault();
});

$(document).keyup(function(event) {
    if (event.keyCode == 9 && event.shiftKey) {
        var selectedarea = getSelection($("#edit-node")[0]);
        var updatedarea = selectedarea.replace(/^    /, '').replace(/\n    /g, '\n');
        
        var value = $("#edit-node").val();
        $("#edit-node").val( $("#edit-node").val().replace(selectedarea, updatedarea) );

        edited = true;
        $("#save-node").html("[Save]");
    }
    else if (event.keyCode == 9) {
        var selectedarea = getSelection($("#edit-node")[0]);
        var updatedarea = "    " + selectedarea.replace(/\n/g, '\n    ');
        
        var value = $("#edit-node").val();
        $("#edit-node").val( $("#edit-node").val().replace(selectedarea, updatedarea) );

        edited = true;
        $("#save-node").html("[Save]");
    }
});


$(document).ready(function () {
    $('#title').html(mneme.title);
    var tree = $('#tree');
    var content = $('#content');
    populateTree(tree, content);

    if ($("#flash").length) {
        $("#flash").fadeOut(5000);
    };
    adjustIconSize();
});
