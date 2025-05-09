document.addEventListener('DOMContentLoaded', function() {
    // React 버전 충돌 해결
    if (window.React) {
        window.React.version = '11.3.2';
    }

    // Google Identity Services 초기화 함수
    function initializeGoogleIdentity() {
        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
                client_id: 'YOUR_CLIENT_ID', // Google Cloud Console에서 발급받은 클라이언트 ID
                callback: handleCredentialResponse
            });
        } else {
            // Google API가 아직 로드되지 않은 경우, 1초 후 다시 시도
            setTimeout(initializeGoogleIdentity, 1000);
        }
    }

    function handleCredentialResponse(response) {
        // Google 로그인 응답 처리
        console.log('Google 로그인 성공:', response);
    }

    // Google Identity Services 초기화 시작
    initializeGoogleIdentity();

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
    const mainVideoId = 'FyKU_s0gcfI';
    const youtubeVideo = document.getElementById('youtubeVideo');

    // 베스트 숙소 영상 썸네일 클릭 이벤트
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    const bestVideoModal = document.getElementById('bestVideoModal');
    const bestVideoFrame = document.getElementById('bestVideoFrame');
    const bestVideoTitle = document.getElementById('bestVideoTitle');
    const bestViewContentBtn = document.getElementById('bestViewContentBtn');
    const bestReserveButton = document.getElementById('bestReserveButton');
    const closeBestModal = bestVideoModal?.querySelector('.close-modal');

    if (thumbnailContainer) {
        thumbnailContainer.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1`;
            if (bestVideoFrame) {
                bestVideoFrame.src = videoUrl;
            }
            if (bestVideoModal) {
                bestVideoModal.style.display = 'block';
            }

            // 영상 정보 가져오기
            fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    if (data.items && data.items.length > 0) {
                        const videoInfo = data.items[0].snippet;
                        if (bestVideoTitle) {
                            bestVideoTitle.textContent = videoInfo.title;
                        }
                        if (bestReserveButton) {
                            bestReserveButton.setAttribute('data-video-id', videoId);
                        }
                    }
                })
                .catch(error => {
                    console.error('유튜브 API 호출 중 오류 발생:', error);
                });
        });
    }

    // 베스트 숙소 모달 닫기
    if (closeBestModal) {
        closeBestModal.addEventListener('click', () => {
            if (bestVideoModal) {
                bestVideoModal.style.display = 'none';
            }
            if (bestVideoFrame) {
                bestVideoFrame.src = 'about:blank';
            }
        });
    }

    // 베스트 숙소 모달 외부 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target === bestVideoModal) {
            bestVideoModal.style.display = 'none';
            if (bestVideoFrame) {
                bestVideoFrame.src = 'about:blank';
            }
        }
    });

    // 베스트 숙소 내용 보기 버튼 클릭 이벤트
    if (bestViewContentBtn) {
        bestViewContentBtn.addEventListener('click', () => {
            const videoId = thumbnailContainer?.getAttribute('data-video-id');
            if (videoId) {
                fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.items && data.items.length > 0) {
                            const videoInfo = data.items[0].snippet;
                            const contentModalTitle = document.getElementById('contentModalTitle');
                            const contentModalDescription = document.getElementById('contentModalDescription');
                            const contentModal = document.getElementById('contentModal');
                            
                            if (contentModalTitle) {
                                contentModalTitle.textContent = videoInfo.title;
                            }
                            if (contentModalDescription) {
                                contentModalDescription.textContent = videoInfo.description;
                            }
                            if (contentModal) {
                                contentModal.style.display = 'block';
                            }
                        }
                    })
                    .catch(error => {
                        console.error('유튜브 API 호출 중 오류 발생:', error);
                    });
            }
        });
    }

    // 베스트 숙소 예약하기 버튼 클릭 이벤트
    if (bestReserveButton) {
        bestReserveButton.addEventListener('click', () => {
            const videoId = thumbnailContainer?.getAttribute('data-video-id');
            if (videoId) {
                window.open(`reserve.html?video_id=${videoId}`, '_blank', 'width=800,height=600');
            }
        });
    }

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

    // 모달 관련 요소들
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const viewContentBtn = document.getElementById('viewContentBtn');
    const reserveButton = document.getElementById('reserveButton');
    const closeModal = videoModal?.querySelector('.close-modal');

    // 썸네일 클릭 이벤트 처리
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (videoId && videoModal && modalVideo) {
                modalVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
                videoModal.style.display = 'flex';
                
                // 비디오 정보 가져오기
                fetchVideoInfo(videoId).then(info => {
                    if (modalTitle) {
                        modalTitle.textContent = info.title;
                    }
                });
            }
        });
    });

    // 비디오 정보 가져오기 함수
    async function fetchVideoInfo(videoId) {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`);
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                return {
                    title: data.items[0].snippet.title,
                    description: data.items[0].snippet.description,
                    publishedAt: data.items[0].snippet.publishedAt
                };
            }
            return { title: '비디오 제목을 불러올 수 없습니다.' };
        } catch (error) {
            console.error('비디오 정보를 가져오는 중 오류 발생:', error);
            return { title: '비디오 제목을 불러올 수 없습니다.' };
        }
    }

    // 모달 닫기 버튼 이벤트
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (videoModal && modalVideo) {
                videoModal.style.display = 'none';
                modalVideo.src = '';
            }
        });
    }

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === videoModal && modalVideo) {
            videoModal.style.display = 'none';
            modalVideo.src = '';
        }
    });

    // 모달의 내용 보기 버튼 클릭 이벤트
    if (viewContentBtn) {
        viewContentBtn.addEventListener('click', () => {
            const videoId = reserveButton?.getAttribute('data-video-id');
            if (videoId) {
                fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.items && data.items.length > 0) {
                            const videoInfo = data.items[0].snippet;
                            const contentModalTitle = document.getElementById('contentModalTitle');
                            const contentModalDescription = document.getElementById('contentModalDescription');
                            const contentModal = document.getElementById('contentModal');
                            
                            if (contentModalTitle) {
                                contentModalTitle.textContent = videoInfo.title;
                            }
                            if (contentModalDescription) {
                                contentModalDescription.textContent = videoInfo.description;
                            }
                            if (contentModal) {
                                contentModal.style.display = 'block';
                            }
                        }
                    })
                    .catch(error => {
                        console.error('유튜브 API 호출 중 오류 발생:', error);
                    });
            }
        });
    }

    // 모달의 예약하기 버튼 클릭 이벤트
    if (reserveButton) {
        reserveButton.addEventListener('click', () => {
            const videoId = reserveButton.getAttribute('data-video-id');
            if (videoId) {
                window.open(`reserve.html?video_id=${videoId}`, '_blank', 'width=800,height=600');
            }
        });
    }

    // 모바일 대응: 화면 크기 변경 시 비디오 높이 조정
    function adjustVideoHeight() {
        const isMobile = window.innerWidth <= 768;
        const videoHeight = isMobile ? 300 : 500;
        document.querySelectorAll('iframe').forEach(iframe => {
            iframe.style.height = `${videoHeight}px`;
        });
    }

    // 초기 로드 시와 화면 크기 변경 시 비디오 높이 조정
    adjustVideoHeight();
    window.addEventListener('resize', adjustVideoHeight);

    // 좋아요 상태를 저장할 객체
    const likeStates = {};

    // 좋아요 버튼 클릭 이벤트 처리
    document.querySelectorAll('.action-button.like').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.closest('.video-section') ? mainVideoId : this.closest('.info-card').querySelector('.watch-video').dataset.videoId;
            
            // 이미 좋아요를 누른 경우
            if (likeStates[videoId]) {
                this.setAttribute('data-liked', 'false');
                const countElement = this.querySelector('.count');
                countElement.textContent = parseInt(countElement.textContent) - 1;
                likeStates[videoId] = false;
            } else {
                this.setAttribute('data-liked', 'true');
                const countElement = this.querySelector('.count');
                countElement.textContent = parseInt(countElement.textContent) + 1;
                likeStates[videoId] = true;
            }
        });
    });

    // 베스트 숙소 영상 정보 가져오기
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${mainVideoId}&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoInfo = data.items[0].snippet;
                document.querySelector('.video-title').textContent = videoInfo.title;
                document.querySelector('.video-stats .date').textContent = new Date(videoInfo.publishedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        })
        .catch(error => {
            console.error('유튜브 API 호출 중 오류 발생:', error);
        });

    // 베스트 숙소 영상의 내용 보기 버튼 클릭 이벤트
    document.querySelector('.video-section .action-button.view-content').addEventListener('click', function() {
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${mainVideoId}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const videoInfo = data.items[0].snippet;
                    document.getElementById('contentModalTitle').textContent = videoInfo.title;
                    document.getElementById('contentModalDescription').textContent = videoInfo.description;
                    document.getElementById('contentModal').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('유튜브 API 호출 중 오류 발생:', error);
            });
    });

    // 베스트 숙소 영상의 예약하기 버튼 클릭 이벤트
    document.querySelector('.video-section .action-button.reserve').addEventListener('click', function() {
        const videoId = this.getAttribute('data-video-id');
        window.open(`reserve.html?video_id=${videoId}`, '_blank', 'width=800,height=600');
    });

    // 공유하기 버튼 클릭 이벤트 처리
    document.querySelectorAll('.action-button.share').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.closest('.video-section') ? 'main' : this.closest('.info-card').querySelector('.watch-video').dataset.videoId;
            const url = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Tripper - 숙소 추천',
                    url: url
                }).catch(console.error);
            } else {
                // 클립보드에 복사
                navigator.clipboard.writeText(url).then(() => {
                    alert('링크가 클립보드에 복사되었습니다.');
                }).catch(console.error);
            }
        });
    });

    // 모달 닫기 버튼 이벤트 처리
    document.querySelector('.content-modal-close').addEventListener('click', function() {
        document.getElementById('contentModal').style.display = 'none';
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        const contentModal = document.getElementById('contentModal');
        if (event.target === contentModal) {
            contentModal.style.display = 'none';
        }
    });

    // YouTube IFrame API 초기화
    function onYouTubeIframeAPIReady() {
        const player = new YT.Player('youtubeVideo', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        // 플레이어 준비 완료
        console.log('YouTube 플레이어 준비 완료');
    }

    function onPlayerStateChange(event) {
        // 플레이어 상태 변경 감지
        console.log('플레이어 상태 변경:', event.data);
    }

    // YouTube IFrame API 로드
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 영상보기 버튼 클릭 이벤트 처리
    document.querySelectorAll('.watch-video').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                // 새 창에서 영상 재생
                const videoWindow = window.open('', '_blank', 'width=800,height=600');
                videoWindow.document.write(`
                    <!DOCTYPE html>
                    <html lang="ko">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>영상 보기</title>
                        <style>
                            body { margin: 0; padding: 20px; background: #fff; }
                            .video-container { width: 100%; padding-bottom: 56.25%; position: relative; }
                            iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
                            .video-info { margin-top: 20px; }
                            .video-title { font-size: 1.2rem; margin-bottom: 10px; }
                            .button-group { display: flex; gap: 10px; margin-top: 15px; }
                            .button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
                            .view-content { background: #4CAF50; color: white; }
                            .reserve { background: #2563eb; color: white; }
                        </style>
                    </head>
                    <body>
                        <div class="video-container">
                            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                            </iframe>
                        </div>
                        <div class="video-info">
                            <h2 class="video-title">영상 제목 로딩 중...</h2>
                            <div class="button-group">
                                <button class="button view-content" onclick="viewContent()">내용 보기</button>
                                <button class="button reserve" onclick="reserve()">예약하기</button>
                            </div>
                        </div>
                        <script>
                            // 영상 정보 가져오기
                            fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}')
                                .then(response => response.json())
                                .then(data => {
                                    if (data.items && data.items.length > 0) {
                                        document.querySelector('.video-title').textContent = data.items[0].snippet.title;
                                    }
                                });

                            // 내용 보기 함수
                            function viewContent() {
                                fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}')
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.items && data.items.length > 0) {
                                            alert(data.items[0].snippet.description);
                                        }
                                    });
                            }

                            // 예약하기 함수
                            function reserve() {
                                window.open('reserve.html?video_id=${videoId}', '_blank', 'width=800,height=600');
                            }
                        </script>
                    </body>
                    </html>
                `);
                videoWindow.document.close();
            }
        });
    });
}); 