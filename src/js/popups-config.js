function funcPopup() {
    const wrapper = document.querySelector('body'),

        popupLinks = document.querySelectorAll('.popupw-link'),
        lockPadding = document.querySelectorAll(".lock-padding"),
        popups = document.querySelectorAll('.popupw');
    let unlock = true
    let videoPlace = null;


    const timeout = 800;

    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.style.pointerEvents = 'auto';
            popupLink.addEventListener("click", function (e) {
                e.preventDefault();
                const popupName = popupLink.getAttribute('data-popup');
                const popupVideo = popupLink.getAttribute('data-video-src');
                const videoType = popupLink.getAttribute('data-video-type');
                const curentPopup = document.getElementById(popupName);
                popupOpen(curentPopup, popupVideo, videoType);

            });
        }
    }
    if (popups.length > 0) {
        for (let index = 0; index < popups.length; index++) {
            const popup = popups[index];
            setTimeout(function () {
                popup.style.visibility = 'visible';
            }, 1500);
        }
    }


    const popupCloseIcon = document.querySelectorAll('[data-close]');
    if (popupCloseIcon.length > 0) {
        for (let index = 0; index < popupCloseIcon.length; index++) {
            const el = popupCloseIcon[index];
            el.addEventListener('click', function (e) {
                popupClose(el.closest('.popupw'));
                e.preventDefault();
            });
        }
    }

    function popupOpen(curentPopup, videoUrl = null, videoType = 'youtube') {
        if (curentPopup && unlock) {
            const popupActive = document.querySelector('.popupw.open');
            videoPlace = curentPopup.querySelector('[data-popup-youtube-place]');
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                bodyLock();
            }
            // создаем тег видео
            if (videoType && videoUrl !== null) {
                videoPlace.classList.add('video-active');
                if (videoType === 'video') {
                    let v = document.createElement("video");
                    v.className = 'videoframe';
                    v.src = videoUrl;
                    v.autoplay = true;
                    v.muted = false;
                    v.controls = true;
                    v.volume = 0.7;
                    v.height = 400;
                    v.width = 700;
                    videoPlace.appendChild(v);
                    if (v.paused) {
                        v.play();
                    }
                    v.addEventListener('canplay', (e) => {
                        setTimeout(function () {
                            videoPlace.classList.add('on-play');
                        }, 1000);
                    })
                    console.log('video-added');
                }
                // создаем iframe youtube
                if (videoType == 'youtube') {
                    let urlVideo = `${videoUrl}?rel=0&showinfo=0&autoplay=1`;
                    let iframe = document.createElement('iframe');
                    iframe.className = 'videoframe';
                    iframe.width = '560';
                    iframe.height = '315';
                    iframe.setAttribute('allowfullscreen', '');
                    iframe.setAttribute('allow', `autoplay; encrypted-media`);
                    iframe.setAttribute('src', urlVideo);
                    if (videoPlace) {
                        videoPlace.appendChild(iframe);
                    }
                }
            }
            curentPopup.classList.add('open');
            curentPopup.addEventListener("click", function (e) {
                if (!e.target.closest('.popupw__content')) {
                    popupClose(e.target.closest('.popupw'));
                }
            });
        }
    }

    function popupClose(popupActive, doUnlock = true) {
        if (popupActive && unlock && popupActive.classList.contains('open')) {
            popupActive.classList.remove('open');
            if (doUnlock) {
                bodyUnLock();
            }
            // чистим ютуб контенйер
            if (videoPlace) {
                videoPlace.classList.remove('video-active','on-play');
                videoPlace.innerHTML = '';
                videoPlace = null;
            }
        }
    }

    function bodyLock() {
        //const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
        let scrollBarWidth = window.innerWidth - wrapper.offsetWidth;
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = scrollBarWidth + 'px';
            }
        }
        wrapper.style.paddingRight = scrollBarWidth + 'px';
        wrapper.classList.add('lock', 'popupw-show');

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    function bodyUnLock() {
        setTimeout(function () {
            if (lockPadding.length > 0) {
                for (let index = 0; index < lockPadding.length; index++) {
                    const el = lockPadding[index];
                    el.style.paddingRight = 0;
                }
            }
            wrapper.style.paddingRight = 0;
            wrapper.classList.remove('lock', 'popupw-show');
        }, timeout);

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    document.addEventListener('keydown', function (e) {
        if (e.which === 27) {
            const popupActive = document.querySelector('.popupw.open');
            popupClose(popupActive);
        }
    });
}
window.addEventListener('load', funcPopup);