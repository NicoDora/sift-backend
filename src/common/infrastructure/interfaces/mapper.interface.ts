export interface IMapper<DomainEntity, PersistenceModel> {
  /** 도메인 엔티티를 DB 모델로 변환 */
  toPersistence(entity: DomainEntity): PersistenceModel;

  /** DB 모델을 도메인 엔티티로 복원 */
  toDomain(raw: PersistenceModel): DomainEntity;
}
