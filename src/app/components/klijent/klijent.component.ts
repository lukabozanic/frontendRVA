import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Klijent } from 'src/app/models/klijent';
import { KlijentService } from 'src/app/services/klijent.service';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { kredit } from 'src/app/models/kredit';
import { KlijentDialogComponent } from '../dialogs/klijent-dialog/klijent-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-klijent',
  templateUrl: './klijent.component.html',
  styleUrls: ['./klijent.component.css']
})
export class KlijentComponent implements OnInit,OnDestroy {

  displayedColumns = ["id","ime","prezime","brojLk","kredit","actions"];
  dataSource!:MatTableDataSource<Klijent>;
  subscription!:Subscription;
  selektovanKlijent!:Klijent;

  @ViewChild(MatSort,{static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;

  constructor(private klijentService:KlijentService,
    private dialog:MatDialog ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadData();
  }

  selectRow(row:Klijent) {
    this.selektovanKlijent = row;
  }

  
  public loadData() {
    this.subscription=this.klijentService.getAllKlijenti().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
    (error:Error) => {

      console.log(error.name + ' '+ error.message);
    });
  }

  public openDialog(flag:number,id?:number,ime?: string, prezime?:string,brojLk?:number,kredit?:kredit) { 

    const dialogRef = this.dialog.open(KlijentDialogComponent,{data:{id,ime,prezime,brojLk,kredit}});

    dialogRef.componentInstance.flag = flag;

    dialogRef.afterClosed().subscribe(result => {
      if(result==1) {

        this.loadData();
      }

    })
  }

  applyFilter(filterValue:any ){
    filterValue = filterValue.target.value;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue;
  }
}
