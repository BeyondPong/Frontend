import { patchLanguage } from "../api/api.js";

export const getStoredLang = () => {
  return localStorage.getItem('lang') || 'en';
};

export const setStoredLang = (lang) => {
  localStorage.setItem('lang', lang);
};

export const changeLanguage = (lang) => {
  registry[1].lang = lang;
  setStoredLang(lang);
  if (registry[0].islogin === true) {
    const data = patchLanguage(lang);
  }
};

const registry = [{ islogin: true }, { lang: getStoredLang() }];

export const words = {
  en: {
    play: 'Play',
    profile: 'Profile',
    login: 'Login',
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
    win: 'Win',
    lose: 'Lose',
  },
  ko: {
    play: '플레이',
    profile: '프로필',
    login: '로그인',
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
    win: '승',
    lose: '패',
  },
  jp: {
    play: 'プレー',
    profile: 'プロフィール',
    login: 'ログイン',
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
    win: '勝ち',
    lose: '負け',
  },
};

export default registry;
