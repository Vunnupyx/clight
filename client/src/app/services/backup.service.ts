import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { HttpService } from 'app/shared';

@Injectable()
export class BackupService {
  constructor(
    private httpService: HttpService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  async download() {
    try {
      const response = await this.httpService.get('/backup', {
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
      this.toastr.error('settings-general.BackupDownloadError');
    }
  }

  async upload(file: File) {
    try {
      const formData = new FormData();
      formData.append('config', file);

      let headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');

      await this.httpService.post('/backup', formData);
    } catch (err: any) {
      this.toastr.error(err.error.message);
    }
  }
}
