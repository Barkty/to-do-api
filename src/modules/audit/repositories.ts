import Audit from './model';

export interface AuditRepository {
    createAudit(param: any): Promise<any>;
}

export class AuditRepositoryImpl implements AuditRepository {
    public async createAudit(param: string): Promise<any> {
        
        const audit = await new Audit(param).save()

        return audit;
    }
}

const auditRepository = new AuditRepositoryImpl();

export default auditRepository;
