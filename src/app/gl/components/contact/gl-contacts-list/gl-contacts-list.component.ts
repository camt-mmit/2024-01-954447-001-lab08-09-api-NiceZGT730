import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Person } from '../../../models/contacts';
import { ContactsService } from '../../../services/contacts.service';
import { OauthService } from '../../../services/oauth.service';

@Component({
  selector: 'app-gl-contacts-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gl-contacts-list.component.html',
  styleUrl: './gl-contacts-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlContactsListComponent implements OnInit {
  private contactsService = inject(ContactsService);
  private oauthService = inject(OauthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  contacts: Person[] = [];
  error: string | null = null;

  async ngOnInit() {
    console.log('GlContactsListComponent: ngOnInit started');
    const accessToken = await this.oauthService.getAccessTokenData();
    console.log('Access Token:', accessToken);
    if (!accessToken) {
      console.log('No access token, redirecting to /login');
      this.router.navigate(['/login']);
      return;
    }
    await this.loadContacts();
  }

  async loadContacts() {
    try {
      console.log('Loading contacts...');
      const params = {
        personFields: 'names,emailAddresses,phoneNumbers,organizations', // เพิ่ม phoneNumbers, organizations
      };
      const response = await firstValueFrom(
        this.contactsService.getContacts(params),
      );
      console.log('API Response:', response);
      this.contacts = [...(response.connections || [])];
      console.log('Contacts set:', this.contacts);
      this.cdr.detectChanges();
      this.error = null;
    } catch (err: any) {
      this.error = err.message || 'Failed to load contacts';
      console.error('Error loading contacts:', err);
    }
  }

  getDisplayName(contact: Person): string {
    const displayName = contact.names?.[0]?.displayName;
    console.log('getDisplayName for contact:', contact, 'result:', displayName);
    return displayName || '';
  }

  getEmail(contact: Person): string {
    const email = contact.emailAddresses?.[0]?.value;
    console.log('getEmail for contact:', contact, 'result:', email);
    return email || '';
  }

  getPhone(contact: Person): string {
    // เพิ่ม
    const phone = contact.phoneNumbers?.[0]?.value;
    console.log('getPhone for contact:', contact, 'result:', phone);
    return phone || '';
  }

  getCompany(contact: Person): string {
    // เพิ่ม
    const company = contact.organizations?.[0]?.name;
    console.log('getCompany for contact:', contact, 'result:', company);
    return company || '';
  }
}
