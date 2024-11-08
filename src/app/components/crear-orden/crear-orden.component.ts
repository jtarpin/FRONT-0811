/*// CrearOrdenComponent
import { Component, OnInit } from '@angular/core';
import { OtService } from '../../services/ot.service';
import { UserService } from '../../services/user.service';
import { Ot } from '../../interfaces/ot';
import { User } from '../../interfaces/user';
import { AssetTypeService } from 'src/app/services/asset-type.service';
import { AssetType } from 'src/app/interfaces/asset-type';

@Component({
  selector: 'app-gestion-ordenes',
  templateUrl: './crear-orden.component.html',
  styleUrls: ['./crear-orden.component.css']
})
export class CrearOrdenComponent implements OnInit {
  ordenes: Ot[] = [];
  users: User[] = []; // Lista para almacenar los usuarios
  assetTypes: AssetType[] = []; // Lista para almacenar los tipos de activos
  selectedOt: Ot | null = null;
  isEditing: boolean = false;

  constructor(
    private otService: OtService,
    private userService: UserService,
    private assetTypeService: AssetTypeService
  ) {
    this.selectedOt = {
      id_ot: 0,
      order_number: '',
      request_date: new Date(),
      initial_date: new Date(),
      completion_date: new Date(),
      observations: '',
      id_user: 0,
      id_task_list: 0,
      id_priority: 0,
      id_ot_state: 0,
      id_tag: 0
    };
  }

  ngOnInit(): void {
    this.getOrdenes();
    this.loadUsers(); // Cargar los usuarios al iniciar el componente\
    this.loadAssetTypes(); // Cargar los tipos de activos al iniciar el componente\
  }

  getOrdenes(): void {
    this.otService.getAll().subscribe({
      next: (data) => this.ordenes = data,
      error: (err) => console.error('Error fetching orders:', err)
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  loadAssetTypes(): void {
    this.assetTypeService.getAll().subscribe({
      next: (data) => this.assetTypes = data,
      error: (err) => console.error('Error fetching users:', err)
    });
  }



  selectOt(ot: Ot): void {
    this.selectedOt = { ...ot };
    this.isEditing = true;
  }

  createOrUpdateOt(): void {
    if (this.selectedOt) {
      if (this.isEditing) {
        this.otService.update(this.selectedOt.id_ot, this.selectedOt).subscribe({
          next: () => {
            this.getOrdenes();
            this.resetForm();
          },
          error: (err) => console.error('Error updating order:', err)
        });
      } else {
        this.otService.create(this.selectedOt).subscribe({
          next: () => {
            this.getOrdenes();
            this.resetForm();
          },
          error: (err) => console.error('Error creating order:', err)
        });
      }
    }
  }

  deleteOt(id: number): void {
    this.otService.delete(id).subscribe({
      next: () => this.getOrdenes(),
      error: (err) => console.error('Error deleting order:', err)
    });
  }

  resetForm(): void {
    this.selectedOt = null;
    this.isEditing = false;
  }
}
*/


import { Component, OnInit } from '@angular/core';
import { OtService } from '../../services/ot.service';
import { TagService } from '../../services/tag.service';
import { UserService } from '../../services/user.service';
import { AssetTypeService } from 'src/app/services/asset-type.service';
import { EdificeService } from 'src/app/services/edifice.service';
import { FloorService } from 'src/app/services/floor.service';
import { SectorService } from 'src/app/services/sector.service';
import { SiteService } from 'src/app/services/site.service';
import { PriorityService } from 'src/app/services/priority.service';
import { Ot } from '../../interfaces/ot';
import { User } from '../../interfaces/user';
import { AssetType } from '../../interfaces/asset-type';
import { Tag } from '../../interfaces/tag';
import { Priority } from '../../interfaces/priority';

@Component({
  selector: 'app-gestion-ordenes',
  templateUrl: './crear-orden.component.html',
  styleUrls: ['./crear-orden.component.css']
})
export class CrearOrdenComponent implements OnInit {
  ordenes: Ot[] = [];
  users: User[] = [];
  assetTypes: AssetType[] = [];
  priorities: Priority[] = [];
  allTags: Tag[] = [];
  filteredTags: Tag[] = [];
  selectedOt: Ot | null = {
    id_ot: 0,
    order_number: '',
    request_date: new Date(),
    initial_date: new Date(),
    completion_date: new Date(),
    observations: '',
    id_user: 0,
    id_task_list: 0,
    id_priority: 0,
    id_ot_state: 0,
    id_tag: 0
  };
  isEditing: boolean = false;

  // Variables de filtro y selección
  selectedAssetType?: number;
  selectedEdifice?: string;
  selectedFloor?: string;
  selectedSector?: string;
  selectedSite?: string;
  selectedAssetNumber?: string;
  selectedPriority?: number;
  selectedTag?: string;  // Para la segunda forma
  mode: 'first' | 'second' = 'first'; // Modo de creación

  constructor(
    private otService: OtService,
    private tagService: TagService,
    private userService: UserService,
    private assetTypeService: AssetTypeService,
    private priorityService: PriorityService,
    private edificeService: EdificeService,
    private floorService: FloorService,
    private sectorService: SectorService,
    private siteService: SiteService
  ) {}

  ngOnInit(): void {
    this.getOrdenes();
    this.loadUsers();
    this.loadAssetTypes();
    this.loadPriorities();
    this.loadAllTags();
  }

  getOrdenes(): void {
    this.otService.getAll().subscribe(data => this.ordenes = data);
  }

  loadUsers(): void {
    this.userService.getAll().subscribe(data => this.users = data);
  }

  loadAssetTypes(): void {
    this.assetTypeService.getAll().subscribe(data => this.assetTypes = data);
  }

  loadPriorities(): void {
    this.priorityService.getAll().subscribe(data => this.priorities = data);
  }

  loadAllTags(): void {
    this.tagService.getAll().subscribe(tags => {
      this.allTags = tags;
      this.filteredTags = tags;
    });
  }

  updateFilteredTags(): void {
    this.filteredTags = this.allTags.filter(tag =>
      (!this.selectedAssetType || tag.asset_type === String(this.selectedAssetType)) &&
      (!this.selectedEdifice || tag.edifice === this.selectedEdifice) &&
      (!this.selectedFloor || tag.floor === this.selectedFloor) &&
      (!this.selectedSector || tag.sector === this.selectedSector) &&
      (!this.selectedSite || tag.site === this.selectedSite) &&
      (!this.selectedAssetNumber || tag.asset_number === this.selectedAssetNumber)
    );
  }

  // Manejadores de cambios
  onAssetTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedAssetType = +target.value;
    this.updateFilteredTags();
  }

  onEdificeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedEdifice = target.value;
    this.updateFilteredTags();
  }

  onFloorChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedFloor = target.value;
    this.updateFilteredTags();
  }

  onSectorChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSector = target.value;
    this.updateFilteredTags();
  }

  onSiteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSite = target.value;
    this.updateFilteredTags();
  }

  onAssetNumberChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedAssetNumber = target.value;
    this.updateFilteredTags();
  }

  onTagChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedTag = this.allTags.find(tag => tag.final_tag === target.value);
    if (selectedTag) {
      this.selectedAssetType = parseInt(selectedTag.asset_type);
      this.selectedEdifice = selectedTag.edifice;
      this.selectedFloor = selectedTag.floor;
      this.selectedSector = selectedTag.sector;
      this.selectedSite = selectedTag.site;
      this.selectedAssetNumber = selectedTag.asset_number;
    }
  }

  get constructedTag(): string {
    return `${this.selectedAssetType || ''}-${this.selectedEdifice || ''}-${this.selectedFloor || ''}-${this.selectedSector || ''}-${this.selectedSite || ''}-${this.selectedAssetNumber || ''}`;
  }

  createOrUpdateOt(): void {
    // Lógica para crear o actualizar la orden de trabajo
  }

  resetForm(): void {
    this.selectedOt = null;
    this.isEditing = false;
  }

  // Métodos para obtener listas únicas
  get uniqueEdifices(): string[] {
    return [...new Set(this.filteredTags.map(tag => tag.edifice))];
  }

  get uniqueFloors(): string[] {
    return [...new Set(this.filteredTags.map(tag => tag.floor))];
  }

  get uniqueSectors(): string[] {
    return [...new Set(this.filteredTags.map(tag => tag.sector))];
  }

  get uniqueSites(): string[] {
    return [...new Set(this.filteredTags.map(tag => tag.site))];
  }
}

