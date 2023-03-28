import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from 'app/shared';
import { Observable, throwError } from 'rxjs';
import {
  HttpEvent,
  HttpEventType,
  HttpProgressEvent,
  HttpResponse
} from '@angular/common/http';
import { catchError, distinctUntilChanged, scan } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

export interface Download {
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}
@Injectable()
export class GeneralService {
  constructor(
    private httpService: HttpService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  downloadLogs(): Observable<Download> {
    return this.httpService
      .download('/logs', {
        responseType: 'blob',
        observe: 'events',
        reportProgress: true
      })
      .pipe(
        this._getEventMessage((blob, filename) => saveAs(blob, filename)),
        catchError((err) => {
          this.toastr.error(
            this.translate.instant('settings-general.LogDownloadError')
          );
          return throwError(err);
        })
      );
  }

  downloadBackup(): Observable<Download> {
    return this.httpService
      .download('/backup', {
        responseType: 'blob',
        observe: 'events',
        reportProgress: true
      })
      .pipe(
        this._getEventMessage((blob, filename) => saveAs(blob, filename)),
        catchError((err) => {
          this.toastr.error(
            this.translate.instant('settings-general.BackupDownloadError')
          );
          return throwError(err);
        })
      );
  }

  async uploadBackup(file: File) {
    try {
      const formData = new FormData();
      formData.append('config', file);

      let headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');

      await this.httpService.post('/backup', formData);
      this.toastr.success(
        this.translate.instant('settings-general.BackupHasBeenUploaded')
      );
    } catch (err: any) {
      this.toastr.error(err.error.message);
    }
  }

  private _getEventMessage(
    saver?: (b: Blob, f: string) => void
  ): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
    return (source: Observable<HttpEvent<Blob>>) =>
      source.pipe(
        scan(
          (download: Download, event): Download => {
            if (this._isHttpProgressEvent(event)) {
              return {
                progress: event.total
                  ? Math.round((100 * event.loaded) / event.total)
                  : download.progress,
                state: 'IN_PROGRESS'
              };
            }
            if (this._isHttpResponse(event)) {
              if (saver) {
                const contentDisposition = event.headers.get(
                  'content-disposition'
                );
                const filename = contentDisposition
                  .split(';')[1]
                  .split('filename')[1]
                  .split('=')[1]
                  .trim();
                saver(event.body, filename);
              }
              return {
                progress: 100,
                state: 'DONE'
              };
            }
            return download;
          },
          { state: 'PENDING', progress: 0 }
        ),
        distinctUntilChanged(
          (a, b) => a.state === b.state && a.progress === b.progress
        )
      );
  }

  private _isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
    return event.type === HttpEventType.Response;
  }

  private _isHttpProgressEvent(
    event: HttpEvent<unknown>
  ): event is HttpProgressEvent {
    return (
      event.type === HttpEventType.DownloadProgress ||
      event.type === HttpEventType.UploadProgress
    );
  }
}
