import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module')
      .then(m => m.ProductsPageModule)
  },
  {
    path: 'hometests',
    loadChildren: () => import('./test/hometests/hometests.module')
      .then(m => m.HomeTestsPageModule)
  },
  {
    path: 'test2dbs',
    loadChildren: () => import('./test/test2dbs/test2dbs.module')
      .then(m => m.Test2dbsPageModule)
  },
  {
    path: 'testreadonly',
    loadChildren: () => import('./test/testreadonly/testreadonly.module')
      .then(m => m.TestReadonlyPageModule)
  },
{
    path: 'testIssue230',
    loadChildren: () => import('./test/testIssue230/testIssue230.module')
      .then(m => m.TestIssue230PageModule)
  },
  {
    path: 'existingconnection',
    loadChildren: () => import('./test/existingconnection/existingconnection.module')
      .then(m => m.ExistingconnectionPageModule)
  },
  {
    path: 'encryption',
    loadChildren: () => import('./test/testencryption/testencryption.module')
      .then(m => m.TestencryptionPageModule)
  },
  {
    path: 'upgradeversion',
    loadChildren: () =>
      import('./test/testupgradeversion/testupgradeversion.module')
        .then(m => m.TestupgradeversionPageModule)
  },
  {
    path: 'importjson',
    loadChildren: () => import('./test/testimportjson/testimportjson.module')
      .then(m => m.TestimportjsonPageModule)
  },
  {
    path: 'exportjson',
    loadChildren: () => import('./test/testexportjson/testexportjson.module')
      .then(m => m.TestexportjsonPageModule)
  },
  {
    path: 'exportjson59',
    loadChildren: () => import('./test/testexportjson59/testexportjson59.module')
      .then(m => m.Testexportjson59PageModule)
  },
  {
    path: 'json71',
    loadChildren: () => import('./test/testjson71/testjson71.module')
      .then(m => m.Testjson71PageModule)
  },
  {
    path: 'json94',
    loadChildren: () => import('./test/testjson94/testjson94.module')
      .then(m => m.Testjson94PageModule)
  },
  {
    path: 'json97',
    loadChildren: () => import('./test/testjson97/testjson97.module')
      .then(m => m.Testjson97PageModule)
  },
  {
    path: 'copyfromassets',
    loadChildren: () => import('./test/copyfromassets/copyfromassets.module')
      .then(m => m.CopyfromassetsPageModule)
  },
  {
    path: 'downloadtocacheandmove',
    loadChildren: () => import('./test/downloadtocacheandmove/downloadtocacheandmove.module')
      .then(m => m.DownloadToCacheAndMoveModule)
  },
  {
    path: 'copy',
    loadChildren: () => import('./test/testcopy/testcopy.module')
      .then(m => m.TestCopyPageModule)
  },
  {
    path: 'ncdatabase',
    loadChildren: () => import('./test/testncdbs/testncdbs.module')
      .then(m => m.TestNCDbsPageModule)
  },
  {
    path: 'test111',
    loadChildren: () => import('./test/testissue111/testissue111.module')
      .then(m => m.TestIssue111PageModule)
  },
  {
    path: 'testtypes',
    loadChildren: () => import('./test/testtypes/testtypes.module')
      .then(m => m.TestTypesPageModule)
  },
  {
    path: 'setsecuresecret',
    loadChildren: () => import('./test/testsetsecuresecret/testsetsecuresecret.module')
      .then(m => m.TestSetSecureSecretPageModule)
  },
  {
    path: 'changesecuresecret',
    loadChildren: () => import('./test/testchangesecuresecret/testchangesecuresecret.module')
      .then(m => m.TestChangeSecureSecretPageModule)
  },
  {
    path: 'testjson1',
    loadChildren: () => import('./test/testjson1extension/testjson1extension.module')
      .then(m => m.TestJson1ExtensionPageModule)
  },
  {
    path: 'json164',
    loadChildren: () => import('./test/testjson164/testjson164.module')
      .then(m => m.Testjson164PageModule)
  },
  {
    path: 'json167',
    loadChildren: () => import('./test/testjson167/testjson167.module')
      .then(m => m.Testjson167PageModule)
  },
  {
    path: 'json192',
    loadChildren: () => import('./test/testjson192/testjson192.module')
      .then(m => m.Testjson192PageModule)
  },
  {
    path: 'json231',
    loadChildren: () => import('./test/testjson231/testjson231.module')
      .then(m => m.Testjson231PageModule)
  },
  {
    path: 'json237',
    loadChildren: () => import('./test/testjson237/testjson237.module')
      .then(m => m.Testjson237PageModule)
  },
  {
    path: 'json245',
    loadChildren: () => import('./test/testjson245/testjson245.module')
      .then(m => m.Testjson245PageModule)
  },
  {
    path: 'json292',
    loadChildren: () => import('./test/testjson292/testjson292.module')
      .then(m => m.Testjson292PageModule)
  },
  {
    path: '',
    redirectTo: 'hometests',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
