// 전역 변수
let studentData = [];

// DOM 요소
const loadingScreen = document.getElementById('loading');
const mainContent = document.getElementById('main-content');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const welcomeMessage = document.getElementById('welcome-message');
const noResultMessage = document.getElementById('no-result-message');
const studentCard = document.getElementById('student-card');
const totalCountSpan = document.getElementById('totalCount');
const searchedIdSpan = document.getElementById('searchedId');

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Lucide 아이콘 초기화 (안전하게)
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide 라이브러리가 로드되지 않았습니다.');
        }
        
        // 데이터 로드
        loadStudentData();
        
        // 이벤트 리스너 등록
        if (searchButton) {
            searchButton.addEventListener('click', handleSearch);
        }
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        }
    } catch (error) {
        console.error('페이지 초기화 오류:', error);
        alert('페이지 로딩 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
    }
});

// 학생 데이터 로드
async function loadStudentData() {
    try {
        console.log('데이터 로딩 시작...');
        
        // 드래그 앤 드롭 기능 설정
        setupFileDropZone();
        
        // 파일 선택 다이얼로그 표시
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx,.xls';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // 파일이 선택되지 않으면 샘플 데이터 사용
        setTimeout(() => {
            if (studentData.length === 0) {
                console.log('파일이 선택되지 않음. 샘플 데이터 사용.');
                alternativeLoadStudentData();
            }
        }, 3000);
        
        fileInput.onchange = async function(e) {
            const file = e.target.files[0];
            if (file) {
                await processExcelFile(file);
            }
            if (document.body.contains(fileInput)) {
                document.body.removeChild(fileInput);
            }
        };
        
        // 사용자에게 안내 메시지 표시
        if (confirm('엑셀 파일을 선택하시겠습니까? (취소 시 샘플 데이터 사용)')) {
            fileInput.click();
        } else {
            alternativeLoadStudentData();
        }
        
    } catch (error) {
        console.error('데이터 로딩 오류:', error);
        alternativeLoadStudentData();
    }
}

// 메인 컨텐츠 표시
function showMainContent() {
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    
    // 아이콘 재생성 (안전하게)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// 검색 처리
function handleSearch() {
    const searchId = searchInput.value.trim();
    
    console.log('검색 시작:', searchId, '(타입:', typeof searchId, ')');
    console.log('전체 학생 수:', studentData.length);
    
    // 모든 결과 숨기기
    hideAllResults();
    
    if (!searchId) {
        showWelcomeMessage();
        return;
    }
    
    // 학생 검색
    const student = studentData.find(s => {
        const studentId = s.학번;
        return studentId?.toString() === searchId || studentId === parseInt(searchId);
    });
    
    console.log('검색 결과:', student ? '찾음' : '못 찾음');
    
    if (student) {
        console.log('찾은 학생:', student.이름, student.학번);
        showStudentCard(student);
    } else {
        showNoResultMessage(searchId);
    }
}

// 모든 결과 숨기기
function hideAllResults() {
    if (welcomeMessage) welcomeMessage.style.display = 'none';
    if (noResultMessage) noResultMessage.style.display = 'none';
    if (studentCard) studentCard.style.display = 'none';
}

// 환영 메시지 표시
function showWelcomeMessage() {
    if (welcomeMessage) welcomeMessage.style.display = 'block';
}

// 검색 결과 없음 메시지 표시
function showNoResultMessage(searchId) {
    if (searchedIdSpan) searchedIdSpan.textContent = searchId;
    if (noResultMessage) noResultMessage.style.display = 'block';
}

// 학생 카드 표시
function showStudentCard(student) {
    // 기본 정보
    const studentNameElement = document.getElementById('studentName');
    const studentIdElement = document.getElementById('studentId');
    const studentClassElement = document.getElementById('studentClass');
    const studentNumberElement = document.getElementById('studentNumber');
    
    if (studentNameElement) studentNameElement.textContent = (student.이름 || '').trim() + ' CARD';
    if (studentIdElement) studentIdElement.textContent = student.학번;
    if (studentClassElement) studentClassElement.textContent = student.반;
    if (studentNumberElement) studentNumberElement.textContent = student.번호;
    
    // 행복의 가치
    const happinessValueElement = document.getElementById('happinessValue');
    const selfEsteemScoreElement = document.getElementById('selfEsteemScore');
    
    if (happinessValueElement) happinessValueElement.textContent = 
        student[' 행복의 가치'] || student['행복의 가치'] || '';
    if (selfEsteemScoreElement) selfEsteemScoreElement.textContent = 
        (student['자아 존중감 점수'] || '') + '점';
    
    // 다중 지능
    const intelligence1Element = document.getElementById('intelligence1');
    const intelligence2Element = document.getElementById('intelligence2');
    const intelligence3Element = document.getElementById('intelligence3');
    
    if (intelligence1Element) intelligence1Element.textContent = student['다중 지능 검사1'] || '';
    if (intelligence2Element) intelligence2Element.textContent = student['다중 지능 검사2'] || '';
    if (intelligence3Element) intelligence3Element.textContent = student['다중 지능 검사3'] || '';
    
    // 롤모델 정보
    const rolemodelNameElement = document.getElementById('rolemodelName');
    const rolemodelTraitElement = document.getElementById('rolemodelTrait');
    const rolemodelMessageElement = document.getElementById('rolemodelMessage');
    
    if (rolemodelNameElement) rolemodelNameElement.textContent = student['롤모델 이름과 직업'] || '';
    if (rolemodelTraitElement) rolemodelTraitElement.textContent = student['롤모델에게 본받거나 닮고 싶은 것'] || '';
    if (rolemodelMessageElement) rolemodelMessageElement.textContent = student['당신을 롤모델로 삼은 사람에게 해주고 싶은 말'] || '';
    
    // 진로 정보
    const gradeElement = document.getElementById('grade');
    const hopeSchoolElement = document.getElementById('hopeSchool');
    const hopeReasonElement = document.getElementById('hopeReason');
    
    if (gradeElement) gradeElement.textContent = student['2학년 성적'] || '';
    if (hopeSchoolElement) hopeSchoolElement.textContent = student['진학 희망 학교'] || '';
    if (hopeReasonElement) hopeReasonElement.textContent = student['희망 학교 이유'] || '';
    
    const fieldExperienceElement = document.getElementById('fieldExperience');
    const fieldExperience = student['현장체험 참여여부'] || '';
    if (fieldExperienceElement) fieldExperienceElement.textContent = fieldExperience;
    
    // 참여 여부에 따른 색상 적용
    if (fieldExperienceElement) {
        fieldExperienceElement.className = 'value';
        if (fieldExperience === '예') {
            fieldExperienceElement.classList.add('participation-yes');
        } else if (fieldExperience === '아니오') {
            fieldExperienceElement.classList.add('participation-no');
        }
    }
    
    // 대인관계 유형
    const relationshipTypeElement = document.getElementById('relationshipType');
    if (relationshipTypeElement) relationshipTypeElement.textContent = student['대인 관계 유형'] || '';
    
    // 미래의 나
    const futureDescriptionElement = document.getElementById('futureDescription');
    if (futureDescriptionElement) futureDescriptionElement.textContent = student['20년 후 35살이 나'] || '';
    
    // 카드 표시
    if (studentCard) studentCard.style.display = 'block';
    
    // 아이콘 재생성 (안전하게)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// 샘플 데이터 (파일을 로드하지 못했을 때 사용)
function loadSampleData() {
    studentData = [
        {
            "학번": 30101,
            "반": 1,
            "번호": 1,
            "이름": "강동호",
            " 행복의 가치": "진정한 사랑",
            "자아 존중감 점수": 14,
            "다중 지능 검사1": "인간 친화 지능",
            "다중 지능 검사2": "자기 성찰 지능",
            "다중 지능 검사3": "자연 친화 지능",
            "롤모델 이름과 직업": "반기문 UN사무총장",
            "롤모델에게 본받거나 닮고 싶은 것": "겸손한",
            "당신을 롤모델로 삼은 사람에게 해주고 싶은 말": "할수있을때 해라",
            "대인 관계 유형": "접근 경향(다른 사람에게 먼저 다가가는 경향)",
            "20년 후 35살이 나": "나의 직업은 삼성회사에 다니는 대단한 회사원이고 여가활동은 여러가지 게임을 하는것이다 내가족은 든든한 아내에 운동을 좋아하는 아들과 소꿉놀이놀 좋아하는 딸 한명이다 아직도 중,고등학교 친구들과 자주 만나서 노는 중이다",
            "2학년 성적": "30%이상 40%미만",
            "진학 희망 학교": "오현고",
            "희망 학교 이유": "집에서 가깝다",
            "현장체험 참여여부": "예"
        },
        {
            "학번": 30102,
            "반": 1,
            "번호": 2,
            "이름": "강민성",
            " 행복의 가치": "나의 가족",
            "자아 존중감 점수": 23,
            "다중 지능 검사1": "인간 친화 지능",
            "다중 지능 검사2": "공간 지능",
            "다중 지능 검사3": "자기 성찰 지능",
            "롤모델 이름과 직업": "나이팅게일, 간호사",
            "롤모델에게 본받거나 닮고 싶은 것": "책임감",
            "당신을 롤모델로 삼은 사람에게 해주고 싶은 말": "당신의 마음을 계속 이으겠어요",
            "대인 관계 유형": "접근 경향(다른 사람에게 먼저 다가가는 경향)",
            "20년 후 35살이 나": "2045년, 난 내가 원하던..은 아니긴하지만 좋고 안정적인 직업인 의사가 됬다 자기전 게임 매크로를 키고 자거나 게임을 만드는 취미가 있다",
            "2학년 성적": "60%이상70%미만",
            "진학 희망 학교": "오현고",
            "희망 학교 이유": "집에서 가깝다",
            "현장체험 참여여부": "아니오"
        }
    ];
    
    console.log('샘플 데이터 로딩 완료:', studentData.length, '명');
    if (totalCountSpan) totalCountSpan.textContent = studentData.length;
}

// 파일 드래그 앤 드롭 기능
function setupFileDropZone() {
    const dropZone = document.body;
    
    // 드래그 이벤트 방지
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    // 드래그 오버 시 스타일 변경
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    // 파일 드롭 처리
    dropZone.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropZone.style.background = 'rgba(79, 70, 229, 0.1)';
    }
    
    function unhighlight() {
        dropZone.style.background = '';
    }
    
    async function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                await processExcelFile(file);
            } else {
                alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
            }
        }
    }
}

// 엑셀 파일 처리
async function processExcelFile(file) {
    try {
        if (loadingScreen) loadingScreen.style.display = 'flex';
        if (mainContent) mainContent.style.display = 'none';
        
        if (typeof XLSX === 'undefined') {
            throw new Error('SheetJS 라이브러리가 로드되지 않았습니다.');
        }
        
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const dataSheet = workbook.Sheets["자료"];
        
        if (!dataSheet) {
            throw new Error('엑셀 파일에서 "자료" 시트를 찾을 수 없습니다.');
        }
        
        const jsonData = XLSX.utils.sheet_to_json(dataSheet);
        
        studentData = jsonData;
        console.log('데이터 로딩 완료:', studentData.length, '명');
        
        if (totalCountSpan) totalCountSpan.textContent = studentData.length;
        showMainContent();
        
    } catch (error) {
        console.error('파일 처리 오류:', error);
        alert('파일을 처리하는 중 오류가 발생했습니다: ' + error.message);
        showMainContent();
    }
}

// 엑셀 파일이 없을 때 대체 로딩 방법
async function alternativeLoadStudentData() {
    try {
        // 실제 환경에서는 서버 API 호출
        // const response = await fetch('/api/students');
        // const data = await response.json();
        // studentData = data;
        
        // 샘플 데이터 사용
        loadSampleData();
        showMainContent();
        
    } catch (error) {
        console.error('데이터 로딩 오류:', error);
        loadSampleData(); // 오류 시 샘플 데이터 사용
        showMainContent();
    }
}