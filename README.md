# Notes App

React 19 + TypeScript + Vite 기반 노트 앱 실습 프로젝트.

## 시작하기

```bash
# 저장소 클론
git clone git@github.com:frongt/ccwork.git
cd ccwork

# 의존성 설치
npm install

# 개발 서버 실행 (프론트 + JSON Server 동시 실행)
npm run dev
```

- 앱: http://localhost:5173
- API: http://localhost:3001/notes

## 스크립트
## 실행 

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 포맷 |
| `npm test` | 테스트 실행 |

## 프로젝트 구조

```
src/
├── api/          # JSON Server API 호출
├── components/   # UI 컴포넌트
├── context/      # React Context (전역 상태)
└── types/        # TypeScript 타입 정의
```
