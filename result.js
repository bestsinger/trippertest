document.addEventListener('DOMContentLoaded', function() {
    // URL에서 검색어 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');

    // 검색어가 없으면 메인 페이지로 리다이렉트
    if (!searchQuery) {
        window.location.href = 'index.html';
        return;
    }

    // 검색어 표시
    document.getElementById('searchQuery').textContent = `"${searchQuery}" 검색 결과`;

    // 특정 유튜브 영상 ID
    const videoId = 'FyKU_s0gcfI';
    const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    document.getElementById('youtubeVideo').src = videoUrl;

    // 유튜브 API 키
    const API_KEY = 'AIzaSyB1I9o012HPhy4cRzC7M5r_riN4LhRhcUM';

    // 제목 요약 함수
    function summarizeTitle(title) {
        // 특수문자 제거
        title = title.replace(/[^\w\s가-힣]/g, '');
        
        // 20자로 제한하고 말줄임표 추가
        if (title.length > 20) {
            return title.substring(0, 20) + '...';
        }
        return title;
    }

    // 각 영상의 제목 가져오기
    const videoIds = ['HBPYv7zgyCg', 'EWE1_J3ducI', 'FyKU_s0gcfI'];
    const cards = document.querySelectorAll('.info-card');

    videoIds.forEach((id, index) => {
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const videoTitle = data.items[0].snippet.title;
                    const summarizedTitle = summarizeTitle(videoTitle);
                    cards[index].querySelector('h4').textContent = summarizedTitle;
                }
            })
            .catch(error => {
                console.error('유튜브 API 호출 중 오류 발생:', error);
            });
    });

    // 모달 관련 요소
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const readMoreBtn = document.getElementById('readMoreBtn');
    const reserveButton = document.getElementById('reserveButton');
    const closeModal = document.querySelector('.close-modal');
    const watchButtons = document.querySelectorAll('.watch-video');

    // 더보기 버튼 클릭 이벤트
    readMoreBtn.addEventListener('click', () => {
        const container = modalDescription.parentElement;
        if (container.scrollTop === 0) {
            // 스크롤을 맨 아래로
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
            readMoreBtn.textContent = '맨 위로';
        } else {
            // 스크롤을 맨 위로
            container.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            readMoreBtn.textContent = '더보기';
        }
    });

    // 영상 보기 버튼 클릭 이벤트
    watchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoId = button.getAttribute('data-video-id');
            modalVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
            
            // 영상 정보 가져오기
            fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    if (data.items && data.items.length > 0) {
                        const videoInfo = data.items[0].snippet;
                        modalTitle.textContent = videoInfo.title;
                        modalDescription.textContent = videoInfo.description;
                        
                        // 설명이 200px를 초과하는 경우 더보기 버튼 표시
                        if (modalDescription.scrollHeight > 200) {
                            readMoreBtn.classList.add('visible');
                        } else {
                            readMoreBtn.classList.remove('visible');
                        }
                        
                        // 예약 버튼에 영상 ID 저장
                        reserveButton.setAttribute('data-video-id', videoId);
                    }
                })
                .catch(error => {
                    console.error('유튜브 API 호출 중 오류 발생:', error);
                });

            modal.style.display = 'block';
        });
    });

    // 예약 버튼 클릭 이벤트
    reserveButton.addEventListener('click', () => {
        const videoId = reserveButton.getAttribute('data-video-id');
        window.location.href = `reserve.html?video_id=${videoId}`;
    });

    // 모달 닫기 버튼 클릭 이벤트
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        modalVideo.src = 'about:blank';
        // 모달이 닫힐 때 스크롤을 맨 위로
        const container = modalDescription.parentElement;
        container.scrollTop = 0;
        readMoreBtn.textContent = '더보기';
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modalVideo.src = 'about:blank';
            // 모달이 닫힐 때 스크롤을 맨 위로
            const container = modalDescription.parentElement;
            container.scrollTop = 0;
            readMoreBtn.textContent = '더보기';
        }
    });
}); 