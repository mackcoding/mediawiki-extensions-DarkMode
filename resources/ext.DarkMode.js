/**
 * Some code adapted from the enwiki gadget https://w.wiki/5Ktj
 */
$( () => {
	const position = mw.config.get( 'wgDarkModeTogglePosition' );

	function isDarkModeEnabled() {
		return document.documentElement.classList.contains( 'skin-theme-clientpref-night' );
	}

	function createNavbarToggle() {
		const darkMode = isDarkModeEnabled();
		const $icon = $( '<i>' ).addClass( darkMode ? 'bi-sun-fill' : 'bi-moon-fill' );
		const $btn = $( '<a>' )
			.attr( {
				href: '#',
				title: mw.msg( darkMode ? 'darkmode-default-link-tooltip' : 'darkmode-link-tooltip' ),
				'aria-label': mw.msg( darkMode ? 'darkmode-default-link' : 'darkmode-link' ),
				role: 'button'
			} )
			.addClass( 'ico-btn ext-darkmode-link ext-darkmode-navbar-toggle' )
			.append( $icon );

		var $li = $( '<li>' ).addClass( 'nav-item' ).append( $btn );
		// eslint-disable-next-line no-jquery/no-global-selector
		var $gearLi = $( '#ga-btn' ).closest( 'li.nav-item' );
		if ( $gearLi.length ) {
			$gearLi.before( $li );
		} else {
			// eslint-disable-next-line no-jquery/no-global-selector
			$( '#nb-pri .navbar-nav' ).last().append( $li );
		}

		return $btn;
	}

	let $darkModeLink;

	if ( position === 'navbar' ) {
		$darkModeLink = createNavbarToggle();
	} else {
		// eslint-disable-next-line no-jquery/no-global-selector
		$darkModeLink = $( '.ext-darkmode-link' );
	}

	function updateLink( darkMode ) {
		if ( position === 'navbar' ) {
			$darkModeLink.find( 'i' )
				.removeClass( 'bi-moon-fill bi-sun-fill' )
				.addClass( darkMode ? 'bi-sun-fill' : 'bi-moon-fill' );
			$darkModeLink
				.attr( 'title', mw.msg( darkMode ? 'darkmode-default-link-tooltip' : 'darkmode-link-tooltip' ) )
				.attr( 'aria-label', mw.msg( darkMode ? 'darkmode-default-link' : 'darkmode-link' ) );
			return;
		}

		if ( darkMode ) {
			$darkModeLink.find( '.mw-ui-icon-moon' )
				.removeClass( 'mw-ui-icon-moon' )
				.addClass( 'mw-ui-icon-bright' );
		} else {
			$darkModeLink.find( '.mw-ui-icon-bright' )
				.removeClass( 'mw-ui-icon-bright' )
				.addClass( 'mw-ui-icon-moon' );
		}

		const labelSelector = [ 'vector' ].includes( mw.config.get( 'skin' ) ) ?
			'span:not( .mw-ui-icon, .vector-icon )' :
			'a';

		$darkModeLink.find( labelSelector )
			.text( mw.msg( darkMode ? 'darkmode-default-link' : 'darkmode-link' ) )
			.attr( 'title', mw.msg( darkMode ?
				'darkmode-default-link-tooltip' :
				'darkmode-link-tooltip'
			) );
	}

	$darkModeLink.on( 'click', ( e ) => {
		e.preventDefault();

		const docClassList = document.documentElement.classList;
		const darkMode = !docClassList.contains( 'skin-theme-clientpref-night' );

		if ( mw.user.isAnon() ) {
			mw.user.clientPrefs.set( 'skin-theme', darkMode ? 'night' : 'day' );
		} else {
			new mw.Api().saveOption( 'darkmode', darkMode ? '1' : '0' );
		}

		if ( darkMode ) {
			docClassList.add( 'skin-theme-clientpref-night' );
			docClassList.add( 'client-darkmode' );
			docClassList.remove( 'skin-theme-clientpref-day' );
		} else {
			docClassList.add( 'skin-theme-clientpref-day' );
			docClassList.remove( 'client-darkmode' );
			docClassList.remove( 'skin-theme-clientpref-night' );
		}

		updateLink( darkMode );

		// eslint-disable-next-line no-jquery/no-global-selector
		$( 'meta[name="theme-color"]' ).attr( 'content', darkMode ? '#000000' : '#eaecf0' );
	} );

	if ( !mw.user.isNamed() && isDarkModeEnabled() ) {
		updateLink( true );
	}
} );
