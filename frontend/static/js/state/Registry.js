import { patchLanguage } from '../api/api.js';

export const getStoredLang = () => {
  return localStorage.getItem('lang') || 'en';
};

export const setStoredLang = (lang) => {
  localStorage.setItem('lang', lang);
};

export const changeLanguage = (lang) => {
  registry.lang = lang;
  setStoredLang(lang);
  if (localStorage.getItem('2fa') !== null) {
    const data = patchLanguage(lang);
  }
};

const registry = { lang: getStoredLang() };

export const words = {
  en: {
    play: 'Play',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
    moveleft: 'moveleft',
    moveright: 'moveright',
    start: 'Start',
    information: 'information',
    history: 'history',
    friends: 'friends',
    search: 'search',
    local: 'Local',
    remote: 'Remote',
    tournament: 'Tournament',
    tournament_nickname_placeholder: 'Please enter a nickname for tournament',
    tournament_nickname_error: 'Nickname has already been taken',
    tournament_table_nickname: 'nickname',
    tournament_table_score: 'score',
    avatar_save_button: 'SAVE',
    avatar_close_button: 'CLOSE',
    win: 'Win',
    lose: 'Lose',
    table_date: 'Date',
    table_opponent: 'Opponent',
    table_score: 'Match Score',
    table_result: 'Result',
    friend_delete_button: 'DELETE',
    friend_search_placeholder: 'Search for a friend...',
    friend_add_button: 'ADD',
    friend_search_error_nomatch: 'No match friends',
    friend_search_error_noinput: 'Please enter a friend name.',
    friend_message_success: 'New friend added successfully!',
    confirm_button: 'OK',
    unregister: 'Unregister',
    title: 'Privacy Policy Agreement',
    content:
      'We, [BeyondPong], are committed to protecting your personal information and complying with relevant laws. Please review the following and give your consent.',
    items: [
      'Purpose of collecting and using personal information: Membership registration and management, service provision and improvement, customer support and inquiry handling, marketing and advertising',
      'Personal information items collected: Required items: Name, email address, password',
      'Legal basis for processing personal information: User consent, contract fulfillment, compliance with legal obligations',
      'Retention and use period of personal information: Retained until membership withdrawal, retained during the preservation period according to laws',
      'User rights: Request access, correction, deletion of personal information, request to restrict processing of personal information, request to transfer personal information, withdraw consent',
      'Sharing of personal information: No sharing with third parties except when legally required',
      'Contact information of the data protection officer: Email: [@naver.com], Phone number: [010-****-****]',
    ],
    agreement: 'I have read and understood the above, and I agree to it.',
    button: 'Agree',
  },
  ko: {
    play: '플레이',
    profile: '프로필',
    login: '로그인',
    logout: '로그아웃',
    moveleft: '왼쪽으로 이동',
    moveright: '오른쪽으로 이동',
    start: '시작',
    information: '정보',
    history: '기록',
    friends: '친구',
    search: '검색',
    local: '로컬 플레이',
    remote: '원격 플레이',
    tournament: '토너먼트',
    tournament_nickname_placeholder: '토너먼트 닉네임을 설정해주세요',
    tournament_nickname_error: '이미 사용 중인 닉네임입니다',
    tournament_table_nickname: '닉네임',
    tournament_table_score: '스코어',
    avatar_save_button: '저장',
    avatar_close_button: '닫기',
    win: '승',
    lose: '패',
    table_date: '날짜',
    table_opponent: '상대',
    table_score: '점수',
    table_result: '결과',
    friend_delete_button: '삭제',
    friend_search_placeholder: '추가할 친구를 검색하세요',
    friend_add_button: '친구추가',
    friend_search_error_nomatch: '일치하는 아이디가 없습니다',
    friend_search_error_noinput: '친구 추가를 위해 아이디를 입력해주세요',
    friend_message_success: '친구 추가가 완료되었습니다',
    confirm_button: '확인',
    unregister: '회원탈퇴',
    title: '개인정보 처리 동의서',
    content: `저희 [BeyondPong]은 귀하의 개인정보를 안전하게 보호하고, 관련 법규를 준수하기 위해 최선을 다하고 있습니다. 아래의 내용을 확인하시고 동의해주시기 바랍니다.`,
    items: [
      '개인정보 수집 및 이용 목적: 회원 가입 및 관리, 서비스 제공 및 개선, 고객 지원 및 문의 처리, 마케팅 및 광고',
      '수집하는 개인정보 항목: 필수 항목: 이름, 이메일 주소, 비밀번호',
      '개인정보 처리의 법적 근거: 사용자 동의, 계약 이행, 법적 의무 준수',
      '개인정보 보유 및 이용 기간: 회원 탈퇴 시까지 보유, 법령에 따른 보존 기간 동안 보유',
      '사용자의 권리: 개인정보 접근, 수정, 삭제 요청, 개인정보 처리 제한 요청, 개인정보 이동 요청, 동의 철회',
      '개인정보 공유: 제3자와의 공유 없음 단, 법적 요구 시 공유 가능',
      '데이터 보호 담당자 연락처: 이메일: [@naver.com], 전화번호: [010-****-****]',
    ],
    agreement: '위 내용을 충분히 읽고 이해하였으며, 이에 동의합니다.',
    button: '동의함',
  },
  jp: {
    play: 'プレー',
    profile: 'プロフィール',
    login: 'ログイン',
    logout: 'ログアウト',
    moveleft: '左に移動',
    moveright: '右に移動',
    start: 'スタート',
    information: '情報',
    history: '履歴',
    friends: '友達',
    search: '検索',
    local: 'ローカルプレイ',
    remote: 'リモートプレイ',
    tournament: 'トーナメント',
    tournament_nickname_placeholder: 'トーナメントニックネームを設定してください。',
    tournament_nickname_error: '既に使用されているニックネームです',
    tournament_table_nickname: 'ニックネーム',
    tournament_table_score: 'スコア',
    avatar_save_button: 'セーブ',
    avatar_close_button: 'とじる',
    win: '勝ち',
    lose: '負け',
    table_date: '試合日',
    table_opponent: '相手',
    table_score: 'スコア',
    table_result: '競技結果',
    friend_delete_button: '削除',
    friend_search_placeholder: 'IDを検索',
    friend_add_button: 'しんせいする',
    friend_search_error_nomatch: '一致するIDがありません。',
    friend_search_error_noinput: '友達追加のためにIDを入力してください。',
    friend_message_success: '友達の追加が完了しました。',
    confirm_button: 'OK',
    unregister: '退会',
    title: '個人情報処理同意書',
    content:
      '私たち[BeyondPong]は、あなたの個人情報を安全に保護し、関連法規を遵守するため最善を尽くしています。以下の内容を確認し、同意してください。',
    items: [
      '個人情報の収集および使用目的：会員登録および管理、サービスの提供および改善、カスタマーサポートおよび問い合わせ対応、マーケティングおよび広告',
      '収集する個人情報の項目：必須項目：名前、メールアドレス、パスワード',
      '個人情報処理の法的根拠：ユーザーの同意、契約の履行、法的義務の遵守',
      '個人情報の保有および利用期間：会員退会時まで保有、法令による保存期間中保有',
      'ユーザーの権利：個人情報へのアクセス、修正、削除の要求、個人情報処理の制限要求、個人情報の移転要求、同意の撤回',
      '個人情報の共有：法的要件がある場合を除き、第三者との共有なし',
      'データ保護担当者の連絡先：メール：[＠naver.com]、電話番号：[010-****-****]',
    ],
    agreement: '上記の内容を十分に読み、理解し、同意します。',
    button: '同意する',
  },
};

export default registry;
