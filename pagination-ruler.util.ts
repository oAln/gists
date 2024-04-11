rulerLength = 5;
maxPages = 0;
totalPages: number;

rulerOption(currentIndex, min) {
    return currentIndex <= min
      ? RulerFactoryOption.Start
      : currentIndex >= this.maxPages - min
      ? RulerFactoryOption.End
      : RulerFactoryOption.Default;
  }

  rulerFactory(currentIndex, index, min) {
    const factory = {
      [RulerFactoryOption.Start]: () => index + 1,
      [RulerFactoryOption.End]: () => this.maxPages - this.rulerLength + index + 1,
      [RulerFactoryOption.Default]: () => currentIndex + index - min
    };

    return factory[this.rulerOption(currentIndex, min)]();
  }

  ruler(currentIndex) {
    const array = new Array(this.rulerLength).fill(null);
    const min = Math.floor(this.rulerLength / 2);

    let respnse = array.map((_, index) => this.rulerFactory(currentIndex, index, min));

    if (this.totalPages < this.rulerLength) {
      respnse = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    return respnse;
  }


  // HTML
  <div class="row trim-margin pagination-block" *ngIf="!noResults">
  <div class="col-md-6 page-nav">
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-end">
        <li id="first" class="page-item">
          <button
            [disabled]="currentPage <= 1"
            title="First"
            class="page-link"
            aria-label="First"
            (click)="navigateToPage(1)"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        <li id="previous" class="page-item">
          <button
            title="Previous"
            class="page-link"
            aria-label="Previous"
            (click)="navigateToPage(currentPage - 1)"
            [disabled]="currentPage <= 1"
          >
            <span aria-hidden="true">&lt;</span>
          </button>
        </li>
        <li class="page-item" *ngFor="let page of pages; trackBy: trackByFn">
          <button
            class="page-link"
            [ngClass]="{ 'active-page': page === currentPage }"
            aria-label="Page Number"
            (click)="navigateToPage(page)"
          >
            {{ page }}
          </button>
        </li>

        <li id="next" class="page-item">
          <button
            class="page-link"
            title="Next"
            aria-label="Next"
            (click)="navigateToPage(currentPage + 1)"
            [disabled]="currentPage >= totalPages"
          >
            <span aria-hidden="true">&gt;</span>
          </button>
        </li>
        <li id="last" class="page-item">
          <button
            [disabled]="currentPage >= totalPages"
            title="Last"
            class="page-link"
            aria-label="Last"
            (click)="navigateToPage(maxPages)"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</div>


// enum
export enum RulerFactoryOption {
    Start = 'START',
    End = 'END',
    Default = 'DEFAULT'
  }

// Func Call
this.pages = this.ruler(page);