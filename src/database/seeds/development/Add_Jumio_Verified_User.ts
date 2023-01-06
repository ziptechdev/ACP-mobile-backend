import { Knex } from 'knex';
import { JumioVerificationProcessStatus } from '../../../models/JumioVerificationProcessStatus';

export const seed = (knex: Knex): Promise<any> => {
  // Inserts seed entries
  return knex('jumio_verification_processes').insert([
    {
      user_refference: 'kyc.registered@example.com',
      account_id: '8ef85a8a-bae2-4556-b30e-3e47a9bca34a',
      workflow_execution_id: '3b5b2f90-900f-46d5-a2e6-21a2caf0373e',
      status: JumioVerificationProcessStatus.PASSED,
      token:
        'eyJraWQiOiJWVGZcL0twY2dqRWZ4azVNS2tSMlFicUdCNHdcL3JTZzRhSk5LV0d0ZkJESDg9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI1M2dwMTIxMnE3MzJ0YWxuNmJkNGc5ZWxoaCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoidHJhbnNhY3Rpb25zXC9hY3F1aXNpdGlvbiB0cmFuc2FjdGlvbnNcL3JldHJpZXZhbCIsImF1dGhfdGltZSI6MTY3MjY4NDExNCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfYkhmV0hBbDFJIiwiZXhwIjoxNjcyNjg3NzE0LCJpYXQiOjE2NzI2ODQxMTQsInZlcnNpb24iOjIsImp0aSI6ImMxODUyY2YxLTJhYmYtNGQ4MS04MWRjLTQ1NGUzMmI0ZmFmNiIsImNsaWVudF9pZCI6IjUzZ3AxMjEycTczMnRhbG42YmQ0ZzllbGhoIn0.svIecAeweyrMw2eo3iPnj7YZe1XKnM1s_tKCBLzEFjewiVYuCz2-Wceia5QoWSBe9HRx822Y0o9LD88RkpRctaukzjfW9uVnTiZncfrtbw5OzgsSp5PAN0hiMYgsCs6uOw2OUuUgJDiqSsb0ypgqvuRfw1nn0_A5PLPjtZnQZTYSQQ5uICifLRIZlVB7AlftWei89oDM_zfV7OOPlH9EU_VQdF3TJg4e3lKBz0pgUYHARSsHQOzGcDdZ-IhuXXK7bx7sTtFYLwRvDOu8n_B7KlTZoiNfFSm0OFvQf7KckjisTyrDzRmeHTndDqQefngPo2iIwYG4cxrD6idzFsg4yw',
      created_at: '2023-01-02 19:28:38.19+01',
      updated_at: '2023-01-02 19:28:38.19+01',
    },
  ]);
};
