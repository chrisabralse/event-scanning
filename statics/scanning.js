document.addEventListener("DOMContentLoaded", function (event) {

	document.getElementById('canvas').addEventListener("qrScanEvent", function (e) {
		let scanData = e.detail;
		attemptCode(scanData);
	});

	startQR_Reader('canvas', 'loadingMessage', 'canvas')


	function attemptCode(scanData) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				playSound('success', this.response);
			}
		};
		xhttp.open("POST", "/scan", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(JSON.stringify({
			scanData: scanData
		}));
	}

	function playSound(type, response) {
		var audio = new Audio(successSound);
		audio.play();
		audio.onended = function () {
			showRegistration(response);
		}

	}

	function showRegistration(response) {
		console.log(response)
		console.log('show registration');
	}

});