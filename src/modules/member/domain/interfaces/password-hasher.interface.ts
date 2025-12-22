export interface IPasswordHasher {
  /** 평문을 해시로 변환 */
  hash(plainText: string): Promise<string>;
  /** 평문과 해시가 일치하는지 비교 */
  compare(plainText: string, hashed: string): Promise<boolean>;
}
