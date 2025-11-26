import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, BackendCategory } from '../../services/category.service';

@Component({
    selector: 'app-admin-categories',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-categories.component.html',
    styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
    categories: BackendCategory[] = [];
    newCategoryName: string = '';
    editingCategory: BackendCategory | null = null;
    editName: string = '';

    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.categoryService.getAll().subscribe({
            next: (data) => this.categories = data,
            error: (err) => console.error('Erreur chargement catégories', err)
        });
    }

    addCategory() {
        if (!this.newCategoryName.trim()) return;

        this.categoryService.create({ libelleCat: this.newCategoryName }).subscribe({
            next: (newCat) => {
                this.categories.push(newCat);
                this.newCategoryName = '';
                alert('Catégorie ajoutée avec succès');
            },
            error: (err) => alert('Erreur lors de l\'ajout de la catégorie')
        });
    }

    startEdit(category: BackendCategory) {
        this.editingCategory = category;
        this.editName = category.libelleCat;
    }

    cancelEdit() {
        this.editingCategory = null;
        this.editName = '';
    }

    updateCategory() {
        if (!this.editingCategory || !this.editName.trim()) return;

        this.categoryService.update(this.editingCategory.idCategory, { libelleCat: this.editName }).subscribe({
            next: (updatedCat) => {
                const index = this.categories.findIndex(c => c.idCategory === updatedCat.idCategory);
                if (index !== -1) {
                    this.categories[index] = updatedCat;
                }
                this.cancelEdit();
                alert('Catégorie mise à jour');
            },
            error: (err) => alert('Erreur lors de la mise à jour')
        });
    }

    deleteCategory(id: number) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        this.categoryService.delete(id).subscribe({
            next: () => {
                this.categories = this.categories.filter(c => c.idCategory !== id);
                alert('Catégorie supprimée');
            },
            error: (err) => alert('Erreur lors de la suppression')
        });
    }
}
