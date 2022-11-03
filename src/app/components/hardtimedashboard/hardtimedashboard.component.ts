import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hardtimedashboard',
  templateUrl: './hardtimedashboard.component.html',
  styleUrls: ['./hardtimedashboard.component.scss']
})
export class HardtimedashboardComponent implements OnInit {

  clearance: boolean = false;

  csvData: any[] = [
    ['Item No.', 'ATA', 'Description', 'Part number', 'Serial number', 'MPD  Task No.', 'DFP task card number', 'Position', 'TCI Task code', 'Reset Date', 'AC FH', 'AC FC', 'Component TSO', 'Component CSO', 'Component TSN', 'Component CSN', 'Flight Hours', 'Flight Cycles', 'Days', 'Flight Hours', 'Flight Cycles', 'Days', 'Flight Hours', 'Flight Cycles', 'Date', 'Flight Hours', 'Flight Cycles', 'Days', 'Listed on status sheet', 'Will meet clearance period?', 'FILE BUILT', 'ARC approval basis (EASA/FAA/Other)', 'Missing records', 'To be added to work scope', 'OIL item number', 'Verified', 'Remarks'],
    ['123', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test', 'test']
  ];

  constructor() { }

  ngOnInit(): void {

  }

}
