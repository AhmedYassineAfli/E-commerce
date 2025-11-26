import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { AdminDiscountsComponent } from './pages/admin-discounts/admin-discounts.component';
import { AdminCategoriesComponent } from './pages/admin-categories/admin-categories.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { OrdersManagementComponent } from './pages/admin/orders-management/orders-management.component';
import { IssuesManagementComponent } from './pages/admin/issues-management/issues-management.component';
import { DelivererComponent } from './pages/deliverer/deliverer.component';
import { DeliverersManagementComponent } from './pages/admin/deliverers-management/deliverers-management.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Accueil' },
  { path: 'products', component: ProductsComponent, title: 'Produits' },
  { path: 'products/:id', component: ProductDetailComponent, title: 'Détail produit' },
  { path: 'login', component: LoginComponent, title: 'Connexion' },
  { path: 'register', component: RegisterComponent, title: 'Inscription' },
  { path: 'cart', component: CartComponent, title: 'Panier' },
  { path: 'checkout', component: CheckoutComponent, title: 'Paiement', canActivate: [AuthGuard] },
  { path: 'my-orders', component: MyOrdersComponent, title: 'Mes Commandes', canActivate: [AuthGuard] },
  { path: 'report-issue/:id', loadComponent: () => import('./pages/report-issue/report-issue.component').then(m => m.ReportIssueComponent), title: 'Signaler un problème', canActivate: [AuthGuard] },
  { path: 'deliverer', component: DelivererComponent, title: 'Tableau de Bord Livreur', canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, title: 'Dashboard Admin', canActivate: [AuthGuard] },
  { path: 'admin/products', component: AdminProductsComponent, title: 'Gestion Produits', canActivate: [AuthGuard] },
  { path: 'admin/discounts', component: AdminDiscountsComponent, title: 'Gestion Remises', canActivate: [AuthGuard] },
  { path: 'admin/categories', component: AdminCategoriesComponent, title: 'Gestion Catégories', canActivate: [AuthGuard] },
  { path: 'admin/deliverers', component: DeliverersManagementComponent, title: 'Gestion des Livreurs', canActivate: [AuthGuard] },
  { path: 'admin/orders-management', component: OrdersManagementComponent, title: 'Gestion Commandes', canActivate: [AuthGuard] },
  { path: 'admin/issues', component: IssuesManagementComponent, title: 'Gestion Signalements', canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
