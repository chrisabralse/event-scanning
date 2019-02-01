let video;

function stopQR_Reader(canvasId, loadingMessageId) {
	let track = video.srcObject.getTracks()[0];
	track.stop();
	let canvas = document.getElementById('canvasId');
	canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	let loadingMessage = document.getElementById(loadingMessageId);
	loadingMessage.innerText = "🛑 Stream stopped...";
	loadingMessage.hidden = false;


}

function startQR_Reader(canvasId, loadingMessageId, eventListenerElementId) {
	let codesScannedTime = {};

	video = document.createElement("video");
	let canvasElement = document.getElementById(canvasId);
	let canvas = canvasElement.getContext("2d");
	let loadingMessage = document.getElementById(loadingMessageId);

	function drawLine(begin, end, color) {
		canvas.beginPath();
		canvas.moveTo(begin.x, begin.y);
		canvas.lineTo(end.x, end.y);
		canvas.lineWidth = 7;
		canvas.strokeStyle = color;
		canvas.stroke();
	}

	// Use facingMode: environment to attempt to get the front camera on phones
	navigator.mediaDevices
		.getUserMedia({
			video: {
				facingMode: "environment"
			}
		})
		.then(function (stream) {
			video.srcObject = stream;
			video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
			video.play();
			requestAnimationFrame(tick);
		});

	function tick() {
		loadingMessage.innerText = "⌛ Loading video...";
		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			loadingMessage.hidden = true;
			canvasElement.hidden = false;

			canvasElement.height = video.videoHeight;
			canvasElement.width = video.videoWidth;
			canvas.drawImage(
				video,
				0,
				0,
				canvasElement.width,
				canvasElement.height
			);
			let imageData = canvas.getImageData(
				0,
				0,
				canvasElement.width,
				canvasElement.height
			);
			let code = jsQR(imageData.data, imageData.width, imageData.height, {
				inversionAttempts: "dontInvert"
			});
			if (code) {
				drawLine(
					code.location.topLeftCorner,
					code.location.topRightCorner,
					"#2669d6"
				);
				drawLine(
					code.location.topRightCorner,
					code.location.bottomRightCorner,
					"#2669d6"
				);
				drawLine(
					code.location.bottomRightCorner,
					code.location.bottomLeftCorner,
					"#2669d6"
				);
				drawLine(
					code.location.bottomLeftCorner,
					code.location.topLeftCorner,
					"#2669d6"
				);
				video.dispatchEvent(
					new CustomEvent("qrScanEvent", {
						detail: code
					})
				);
			}
		}
		requestAnimationFrame(tick);
	}

	video.addEventListener("qrScanEvent", function (e) {
		if (codesScannedTime[e.detail.data]) {
			let timeSinceLastScan = Math.abs(
				new Date() - codesScannedTime[e.detail.data]
			);
			if (timeSinceLastScan > 5000) {
				registerScan(e.detail.data);
			}
		} else {
			registerScan(e.detail.data);
		}
	});

	function registerScan(data) {
		codesScannedTime[data] = new Date();
		document.getElementById(eventListenerElementId).dispatchEvent(
			new CustomEvent("qrScanEvent", {
				detail: data
			})
		);
	}

}