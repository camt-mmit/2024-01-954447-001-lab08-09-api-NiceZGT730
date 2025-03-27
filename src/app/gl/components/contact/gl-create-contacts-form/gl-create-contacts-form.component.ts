import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RequiredProperties } from '../../../models';
import {
  ContactCreateBody,
  EmailAddress,
  Name,
  Organization,
  PhoneNumber,
} from '../../../models/contacts';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-gl-create-contacts-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gl-create-contacts-form.component.html',
  styleUrl: './gl-create-contacts-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlCreateContactsFormComponent {
  private contactsService = inject(ContactsService);
  private router = inject(Router);

  // เพิ่ม phone และ company ใน newContact
  newContact = {
    givenName: '',
    familyName: '',
    email: '',
    phone: '',
    company: '',
  };
  error: string | null = null;

  async createContact() {
    try {
      console.log('Creating contact...', this.newContact);
      const contact: ContactCreateBody = {
        names: [
          {
            givenName: this.newContact.givenName,
            familyName: this.newContact.familyName,
          } as RequiredProperties<Name, 'givenName'>,
        ],
        emailAddresses: this.newContact.email
          ? [{ value: this.newContact.email } as EmailAddress]
          : undefined,
        phoneNumbers: this.newContact.phone
          ? [{ value: this.newContact.phone } as PhoneNumber]
          : undefined, // เพิ่ม phoneNumbers
        organizations: this.newContact.company
          ? [{ name: this.newContact.company } as Organization]
          : undefined, // เพิ่ม organizations
      };
      const response = await firstValueFrom(
        this.contactsService.createContact(contact),
      );
      console.log('Contact created:', response);
      this.newContact = {
        givenName: '',
        familyName: '',
        email: '',
        phone: '',
        company: '',
      };
      this.error = null;
      this.router.navigate(['/google/contacts']); // กลับไปหน้า list
    } catch (err: any) {
      1;
      this.error = err.message || 'Failed to create contact';
      console.error('Error creating contact:', err);
    }
  }
}
