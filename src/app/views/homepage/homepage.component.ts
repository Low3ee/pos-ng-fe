import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { UserService } from '../../services/api/user/user.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, QRCodeModule, NgIf],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  qrData: string = '';
  showQRCode: boolean = false;
  name = 'Balay ni nilo';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.validateToken();
  }
  generateQRCode() {
    let code = this.generateUniqueKey();
    this.qrData = `http://localhost:4200/order/${code}`;
    console.log(code);
    this.showQRCode = true;

    localStorage.setItem('orderNumber', code);
    console.log(this.qrData);
  }

  generateUniqueKey(): string {
    return Math.random().toString(36).substr(2, 10) + Date.now().toString(36);
  }

  generateCode(): string {
    const randomPart = Math.random().toString(36).substr(2, 10);
    const timestampPart = Date.now().toString(36);
    const hashPart = btoa(randomPart + timestampPart).substr(0, 10);
    return `${randomPart}-${timestampPart}-${hashPart}`;
  }

  printQRCode() {
    // Delay the print operation slightly to ensure rendering
    setTimeout(() => {
      const printSection = document.getElementById('qrCodeSection');
      if (printSection) {
        const originalContents = document.body.innerHTML;
        const printContents = printSection.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
      } else {
        alert('No QR code available to print.');
      }
    }, 500); // Adjust delay as necessary
  }
  
}
