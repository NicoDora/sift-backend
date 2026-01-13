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
