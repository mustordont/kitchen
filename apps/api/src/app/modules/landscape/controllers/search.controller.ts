import {
    EModules,
    ILandscapeSearchHostResult,
    ILandscapeSearchKuberResult,
    ILandscapeSearchPage,
} from '@kitchen/api-interfaces';
import {
    LandscapeSearchHostPageDto,
    LandscapeSearchKuberPageDto, LandscapeSearchRequestHostDto, LandscapeSearchRequestKuberDto
} from '@kitchen/domain';
import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiTags} from '@nestjs/swagger';

import {SearchService} from '../services';

@ApiTags(EModules.LANDSCAPE)
@UseGuards(AuthGuard())
@Controller('landscape/search')
export class LandscapeSearchController {
    constructor(
        private readonly _searchService: SearchService,
    ) {}

    @ApiResponse({status: 200, type: LandscapeSearchKuberPageDto})
    @Post('/kuber')
    searchByKuber(@Body() request: LandscapeSearchRequestKuberDto): Promise<ILandscapeSearchPage<ILandscapeSearchKuberResult>> {
        return this._searchService.searchAppsByKuber(request);
    }

    @ApiResponse({status: 200, type: LandscapeSearchHostPageDto})
    @Post('/host')
    searchByHost(@Body() request: LandscapeSearchRequestHostDto): Promise<ILandscapeSearchPage<ILandscapeSearchHostResult>> {
        return this._searchService.searchAppsByHost(request);
    }
}
