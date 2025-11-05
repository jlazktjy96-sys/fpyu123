function sendUserIdToTagtoo() {
    var url = document.getElementById("target").value;
    tuec.send({ partnerId: 1009, userId: 'test_user_id', arg: {link: url} })
}
window.tagtoo_advertiser_id = 3195;

const $track = document.createElement('script');
$track.src = 'https://ecs.tagtoo.co/js/unitrack.js';
document.head.appendChild($track);

const $finger = document.createElement('script');
$finger.src = 'https://ecs.tagtoo.co/js/fp.min.js';
document.head.appendChild($finger);

const $sdkScript = document.createElement('script');
$sdkScript.src = 'https://uec.tagtoo.co/tuec.js';
document.head.appendChild($sdkScript);
$sdkScript.onload = function () {
    sendUserIdToTagtoo()
}