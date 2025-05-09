// 사이드바 토글 기능
document.querySelector('.fa-bars').addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('expanded');
});

// 검색 기능
document.querySelector('.search-bar button').addEventListener('click', () => {
    const searchTerm = document.querySelector('.search-bar input').value;
    if (searchTerm.trim()) {
        // 여기에 검색 로직 추가
        console.log('검색어:', searchTerm);
    }
});

// 비디오 카드 클릭 이벤트
const videoIds = [
    'EWE1_J3ducI',
    'AXFE68huESY',
    'DLHA3Qy2IyY',
    'rw5hWbRzUAo',
    'FyKU_s0gcfI'
];

document.querySelectorAll('.video-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        window.open(`video-detail.html?v=${videoIds[index]}`, '_blank');
    });
});

// 사이드바 아이템 클릭 이벤트
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
        // 활성화된 아이템 스타일 변경
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
}); 