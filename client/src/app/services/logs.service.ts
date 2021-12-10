import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { HttpService } from 'app/shared';

@Injectable()
export class LogsService {
  constructor(
    private httpService: HttpService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  async download() {
    try {
      const response = await this.httpService.get('/logs', {
        responseType: 'blob',
        observe: 'response'
      } as any);

      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
        .split(';')[1]
        .split('filename')[1]
        .split('=')[1]
        .trim();

      saveAs(response.body, filename);
    } catch {
      this.toastr.error('settings-general.LogDownloadError');
    }
  }

}
