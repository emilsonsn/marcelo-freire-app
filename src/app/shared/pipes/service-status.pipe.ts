import { Pipe, PipeTransform } from '@angular/core';
import { PaymentForm } from '@models/application';
import { ServiceStatus } from '@models/service';

@Pipe({
  name: 'service_status'
})
export class ServiceStatusPipe implements PipeTransform {

  transform(value: ServiceStatus) {
    switch (value) {
      case ServiceStatus.Pending:
        return 'Pendente';
      case ServiceStatus.Deliver:
        return 'Entregue';
      default:
        return value;
    }
  }

}
