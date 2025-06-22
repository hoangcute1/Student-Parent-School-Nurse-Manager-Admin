import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentStudent, ParentStudentSchema } from '@/schemas/parent-student.schema';
import { ParentStudentService } from '@/services/parent-student.service';
import { ParentStudentController } from '@/controllers/parent-student.controller';
import { StudentModule } from './student.module';
import { HealthRecordModule } from './health-record.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ParentStudent.name, schema: ParentStudentSchema }]),
    forwardRef(() => StudentModule),
    HealthRecordModule,
  ],
  controllers: [ParentStudentController],
  providers: [ParentStudentService],
  exports: [ParentStudentService],
})
export class ParentStudentModule {}
