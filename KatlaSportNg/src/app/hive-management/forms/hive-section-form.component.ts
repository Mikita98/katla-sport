import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HiveSection } from '../models/hive-section';
import { HiveSectionService } from '../services/hive-section.service';

@Component({
  selector: 'app-hive-section-form',
  templateUrl: './hive-section-form.component.html',
  styleUrls: ['./hive-section-form.component.css']
})
export class HiveSectionFormComponent implements OnInit {

  hiveSection = new HiveSection(0, "", "", false, "", 0);
  existed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveSectionService: HiveSectionService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p['storehiveId'] === undefined)
      {
          this.hiveSection.storeHiveId = p["id"];
      }
      else
      {
        this.hiveSectionService.getHiveSection(p['storehiveId']).subscribe(h => this.hiveSection = h);
        this.existed = true;
      }
    });
  }

  navigateToHivesSection() {
    this.router.navigate([`/hive/${this.hiveSection.storeHiveId}/sections`]);
  }

  onCancel() {
    this.navigateToHivesSection();
  }

  onSubmit() {
    if (this.existed)
    {
      this.hiveSectionService.updateHiveSection(this.hiveSection).subscribe(h => this.navigateToHivesSection());
    }
    else
    {
      this.hiveSectionService.addHiveSection(this.hiveSection).subscribe(h => this.navigateToHivesSection());
    }
  }

  onDelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, true).subscribe(h => this.hiveSection.isDeleted = true);
  }

  onUndelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, false).subscribe(h => this.hiveSection.isDeleted = false);
  }

  onPurge() {
    this.hiveSectionService.deleteHiveSection(this.hiveSection.id).subscribe(h => this.navigateToHivesSection());
  }
}
