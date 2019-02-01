function showToast(type, message) {
	let toast = document.createElement('div');
	document.getElementById('result').after(
		toast
	);
	toast.innerHTML = message;
	toast.classList.add('toast');
	toast.classList.add(type);
	toast.classList.add('pop');
	setTimeout(function () {
		toast.classList.remove(type);
		toast.classList.remove('pop');
		toast.classList.add('fade');
		setTimeout(function () {
			toast.classList.remove('fade');
			toast.remove();
		}, 200)

	}, 1000);
}


document.addEventListener("DOMContentLoaded", function (event) {

	let currentURL = new URL(window.location.href);
	let token = currentURL.searchParams.get('token');


	document.getElementById('canvas').addEventListener("qrScanEvent", function (e) {
		let scanData = e.detail;
		attemptCode(scanData);
	});

	startQR_Reader('canvas', 'loadingMessage', 'canvas');

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


	function playErrorSound() {
		var audio = new Audio(errorSound);
		audio.play();

	}

	function showRegistrationStatus(response) {
		console.log('show registration status');
		switch (response.status) {
			case 'not found':
				playErrorSound();
				showToast('error', 'Not found')
				break;
			case 'already checked in':
				showToast('error', 'Already checked in')

				playErrorSound();
				break;
			case 'success':
				console.log(response.result);
				playSuccessSound();
				showToast('success', 'Checked in!')

				break;
		}
	}
});