// 인기 여행지 데이터
const popularDestinations = [
    {
        name: '제주도',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
        description: '아름다운 해변과 한라산이 있는 섬'
    },
    {
        name: '부산',
        image: 'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=500',
        description: '바다와 현대적인 도시가 공존하는 곳'
    },
    {
        name: '강원도',
        image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=500',
        description: '아름다운 산과 계곡이 있는 자연의 보고'
    },
    {
        name: '서울',
        image: 'https://images.unsplash.com/photo-1538485399081-7c8ed730643d?w=500',
        description: '한국의 수도, 현대와 전통이 공존하는 도시'
    }
];

// 여행지 카드 생성 함수
function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    
    card.innerHTML = `
        <img src="${destination.image}" alt="${destination.name}" class="destination-image">
        <div class="destination-info">
            <h4>${destination.name}</h4>
            <p>${destination.description}</p>
        </div>
    `;
    
    return card;
}

// 여행지 카드들을 그리드에 추가
function renderDestinations() {
    const grid = document.getElementById('destinationGrid');
    popularDestinations.forEach(destination => {
        const card = createDestinationCard(destination);
        grid.appendChild(card);
    });
}

// 검색 폼 제출 처리
document.querySelector('button').addEventListener('click', function() {
    const searchQuery = document.querySelector('input').value;
    if (searchQuery.trim() !== '') {
        console.log('검색어:', searchQuery);
        // 여기에 숙소 검색 로직 구현
        alert(`"${searchQuery}"에 대한 숙소 검색 결과를 보여드립니다.`);
    } else {
        alert('검색어를 입력해주세요.');
    }
});

// 페이지 로드 시 여행지 카드 렌더링
document.addEventListener('DOMContentLoaded', renderDestinations); 