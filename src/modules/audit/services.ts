import auditRepository, { AuditRepository } from "./repositories";

export interface AuditServices {
    createAuditLog(args: any): Promise<any>
}

export class AuditServicesImpl implements AuditServices {
    constructor(
        private readonly auditRepository: AuditRepository
      ) { }
    public async createAuditLog(args: any): Promise<any> {
        return await this.auditRepository.createAudit(args)
    }
}

const auditServices = new AuditServicesImpl(auditRepository);

export default auditServices;