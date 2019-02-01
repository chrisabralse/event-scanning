document.addEventListener("DOMContentLoaded", function (event) {

	let currentURL = new URL(window.location.href);
	let token = currentURL.searchParams.get('token');


	document.getElementById('canvas').addEventListener("qrScanEvent", function (e) {
		let scanData = e.detail;
		attemptCode(scanData);
	});

	startQR_Reader('canvas', 'loadingMessage', 'canvas')


	function attemptCode(scanData) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				showRegistrationStatus(JSON.parse(this.response));
			}
		};
		xhttp.open("POST", "/scan", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(JSON.stringify({
			scanData: scanData,
			token: token
		}));
	}

	function playSuccessSound() {
		var audio = new Audio(successSound);
		audio.play();
	}


	function playErrorSound(count) {
		var audio = new Audio(errorSound);
		audio.play();
		audio.onended = function () {
			if (count < 1) {
				playErrorSound(count + 1);
			}
		}

	}

	function showRegistrationStatus(response) {
		console.log('show registration status');
		switch (response.status) {
			case 'not found':
				playErrorSound(0);
				break;
			case 'already checked in':
				playErrorSound(0);
				break;
			case 'success':
				console.log(response.result);
				playSuccessSound(0);
				break;
		}
	}
});