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
  if (localStorage.getItem('token') !== null) {
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
  },
};

export default registry;
