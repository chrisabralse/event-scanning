document.addEventListener("DOMContentLoaded", function (event) {

	document.getElementById('canvas').addEventListener("qrScanEvent", function (e) {
		let scanData = e.detail;
		var audio = new Audio(successSound);
		audio.play();
		audio.onended = function () {
			//window.location = '/pair?eId=' + scanData;
		}
	});

	startQR_Reader('canvas', 'loadingMessage', 'canvas')


});