window.onload = function () {
    setTimeout(() => {
        let target = document.getElementById('target').value;
        if (target) {
            window.location.replace(target);
        } else {
            console.log(target);
        }
    }, 300)
}