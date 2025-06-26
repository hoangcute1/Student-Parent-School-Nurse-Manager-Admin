import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from '@/schemas/student.schema';
import { StudentService } from '@/services/student.service';
import { StudentController } from '@/controllers/student.controller';
import { ParentModule } from '@/modules/parent.module';
import { ParentStudentModule } from '@/modules/parent-student.module';
import { HealthRecordModule } from './health-record.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    ParentModule,
    forwardRef(() => ParentStudentModule),
    HealthRecordModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
