
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