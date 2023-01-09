import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from 'app/shared';
import { Observable } from 'rxjs';
import {
  HttpEvent,
  HttpEventType,
  HttpProgressEvent,
  HttpResponse
} from '@angular/common/http';
import { distinctUntilChanged, scan } from 'rxjs/operators';

export interface Download {
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}
@Injectable()
export class LogsService {
  constructor(
    private httpService: HttpService,
    private toastr: ToastrService
  ) {}

  download(): Observable<Download> {
    try {
      return this.httpService
        .download('/logs', {
          responseType: 'blob',
          observe: 'events',
          reportProgress: true
        })
        .pipe(this._getEventMessage((blob) => saveAs(blob, 'logs.zip')));
    } catch {
      this.toastr.error('settings-general.LogDownloadError');
    }
  }

  private _getEventMessage(
    saver?: (b: Blob) => void
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
                saver(event.body);
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
