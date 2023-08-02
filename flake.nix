{
  inputs = {
	  nixpkgs.url = "github:nixos/nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
	      pkgs = nixpkgs.legacyPackages.${system};
      in {
		    devShells.default = pkgs.mkShell { 
          buildInputs = [
            pkgs.nodejs
            pkgs.nodePackages.pnpm
          ];
		      name = "wheatonil";
          shellHook = ''
            export PATH=`pwd`/scripts:`pwd`/node_modules/.bin:$PATH
          '';
		};
      });
  nixConfig = {
	  bash-prompt-prefix = "WHEATONIL: ";
  };
}
