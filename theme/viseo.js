
/**
 * Close channels categories if a channel is already in flow
 *
 **/
RED.events.on('nodes:add', function(node) {
	if($("#palette-container-📻_channels").hasClass('palette-closed')) {
		return;
	}
	if($("#palette-📻_channels #palette_node_"+node.type).length == 1) {
		$("#palette-header-📻_channels").click();
	}
})

/**
 * Add custom button to update the framework
 *
 **/
RED.events.on('editor:open', function() {

	setTimeout(function() {
		customDependency();
		customPalette();
	}, 0);
})

const customPalette = () => {
	var $paletteDiv = $("#user-settings-tab-palette");
	if($paletteDiv.length == 1) {
		setTimeout(function() {
			$("#palette-editor .palette-search input[type='text']").val("node-red").searchBox('change')
		}, 500);
	}

}


const customDependency = () => {

	var $dependenciesDiv = $("#project-settings-tab-deps");
	if($dependenciesDiv.length == 1) {

		$.get('viseo-bot-framework/versions', function(data) {

			if(data.updates.length > 0) {


				var $formgroup = $('<div class="form-inline" style="display:inline">');

				var $select = $('<select id="viseo-framework-versions" style="width:100px;margin-left:8px" class="form-control">');
				for(var value of data.updates) {
					$select.append('<option value="'+value+'">to '+value+'</option>');
				}
				$formgroup.prepend($select);

				$formgroup.prepend('<button id="update-viseo-framework" class="btn btn-secondary form-control">Update VISEO Bot Maker</button>');

				$dependenciesDiv.prepend($formgroup);

				$('#viseo-framework-versions option').last().prop('selected', 1);

				$("#update-viseo-framework").click(function() {
					$.post("viseo-bot-framework/update", {version: $("#viseo-framework-versions").val()}, function() {
					})
				});
			} else {
				$dependenciesDiv.prepend('<p style="float:left;margin-top:10px">No VISEO Bot Maker update available</p>');
			}
		});
	}

}