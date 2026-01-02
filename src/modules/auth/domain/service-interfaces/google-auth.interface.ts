export interface IGoogleAuthOptions {
  /** 구글 인증 페이지로 이동할 전체 URL */
  url: string;
  /** CSRF 방지를 위해 생성된 상태 값 */
  state: string;
  /** ID 토큰 재전송 공격 방지를 위해 생성된 임의 값 */
  nonce: string;
}

export interface IHandleGoogleLoginParams {
  /** 구글 인가 코드 */
  code: string;
  /** 쿠키/세션에 저장되었던 state */
  savedState: string;
  /** 구글로부터 돌아온 state */
  requestState: string;
  /** 쿠키/세션에 저장되었던 nonce */
  savedNonce: string;
}

export interface IGoogleUser {
  /** 발급자 */
  iss: string;
  /** 클라이언트 ID */
  azp: string;
  /** 대상 */
  aud: string;
  /** 구글 사용자 고유 ID */
  sub: string;
  /** 사용자 이메일 */
  email: string;
  /** 이메일 인증 여부 ('true'/'false') */
  email_verified: string;
  /** 토큰 해시 */
  at_hash: string;
  /** 이름 */
  name: string;
  /** 프로필 이미지 URL */
  picture: string;
  /** 이름 */
  given_name: string;
  /** 요청 시 전달했던 nonce */
  nonce: string;
  /** 발급 시간 */
  iat: string;
  /** 만료 시간 */
  exp: string;
}
